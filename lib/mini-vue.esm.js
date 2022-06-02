function isObject(params) {
    return typeof params === "object" && params !== null;
}
var extend = Object.assign;
var hasOwn = function (val, key) { return Object.hasOwnProperty.call(val, key); };
var camelize = function (str) {
    return str.replace(/-(\w)/, function (_, target) {
        return capitalize(target);
    });
};
var capitalize = function (str) {
    return str.charAt(0) ? str.charAt(0).toUpperCase() + str.slice(1) : "";
};
function toHandlerKey(str) {
    return "on" + camelize(capitalize(str));
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        if (hasOwn(props, key)) {
            return props[key];
        }
        var publicHandler = publicPropertiesMap[key];
        if (publicHandler) {
            return publicHandler(instance);
        }
    },
};

function initProps(instance) {
    var _a;
    instance.props = (_a = instance.vnode.props) !== null && _a !== void 0 ? _a : {};
}

var bucket = new Map();
function trigger(target, key) {
    var depsMap = bucket.get(target);
    if (!depsMap)
        return;
    var deps = depsMap.get(key);
    if (!deps)
        return;
    triggerEffects(deps);
}
function triggerEffects(deps) {
    deps.forEach(function (dep) {
        if (dep === null || dep === void 0 ? void 0 : dep.scheduler) {
            dep.scheduler();
        }
        else {
            dep.run();
        }
    });
}

var get = createGetter();
var set = createSetter();
var mutableHandler = {
    get: get,
    set: set,
};
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
var readonlyHandler = {
    get: readonlyGet,
    set: function (target, key) {
        console.warn("set readonly target key: ".concat(key, " failed"), target);
        return target[key];
    },
};
extend({}, readonlyHandler, {
    get: shallowReadonlyGet,
});
function createGetter(isReadonly, isShallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (isShallow === void 0) { isShallow = false; }
    return function get(target, key) {
        if (key === ReactiveFlags.isReactive) {
            return !isReadonly;
        }
        if (key === ReactiveFlags.isReadonly) {
            return isReadonly;
        }
        var res = target[key];
        if (isShallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}

var ReactiveFlags = {
    isReactive: Symbol("isReactive"),
    isReadonly: Symbol("isReadonly"),
};
function reactive(raw) {
    return createActiveObject(raw, mutableHandler);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandler);
}
function createActiveObject(raw, handler) {
    return new Proxy(raw, handler);
}

function emit(instance, eventName) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    //  const  toHandlerKey =
    var handlerName = toHandlerKey(eventName);
    var handler = instance.props[handlerName];
    if (handler) {
        handler(args);
    }
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        emit: function () { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance);
    // initSlot();
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(readonly(instance.props), {
            emit: instance.emit,
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (isObject(setupResult)) {
        // extends object
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
    else {
        processElement(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    // const subTree = instance.render.call(instance.setupState);
    // TODO maybe sometime don't need this if
    if (instance.render) {
        var subTree = instance.render.call(instance.proxy);
        patch(subTree, container);
        vnode.el = subTree.el;
    }
}
function processElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, props = vnode.props;
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    for (var key in props) {
        var reg = /^on[A-Z]/;
        if (key.match(reg)) {
            var eventName = key.slice(2).toLowerCase();
            el.addEventListener(eventName, props[key]);
        }
        else {
            el.setAttribute(key, props[key]);
        }
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (item) {
        patch(item, container);
    });
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

var h = createVNode;

export { createApp, h };
