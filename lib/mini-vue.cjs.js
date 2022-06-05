'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(params) {
    return typeof params === "object" && params !== null;
}
var extend = Object.assign;
var hasChanged = function (value, oldValue) {
    return !Object.is(value, oldValue);
};
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
    $slots: function (i) { return i.slots; },
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

function initProps(instance, rawProps) {
    instance.props = rawProps !== null && rawProps !== void 0 ? rawProps : {};
}

var bucket = new Map();
var activeEffect;
var shouldTrack = true;
var ReactiveEffect = /** @class */ (function () {
    function ReactiveEffect(fn, options) {
        this.fn = fn;
        this.active = true;
        this.deps = [];
        this.scheduler = options === null || options === void 0 ? void 0 : options.scheduler;
        this.onStop = options === null || options === void 0 ? void 0 : options.onStop;
    }
    ReactiveEffect.prototype.run = function () {
        if (!this.active) {
            return this.fn();
        }
        shouldTrack = true;
        activeEffect = this;
        var result = this.fn();
        shouldTrack = false;
        return result;
    };
    ReactiveEffect.prototype.stop = function () {
        shouldTrack = false;
        if (this.active) {
            cleanup(this);
            this.active = false;
            if (this === null || this === void 0 ? void 0 : this.onStop) {
                this.onStop();
            }
        }
    };
    return ReactiveEffect;
}());
function cleanup(effect) {
    effect.deps.forEach(function (dep) {
        dep.delete(effect);
    });
}
function effect(fn, options) {
    var _effect = new ReactiveEffect(fn, options);
    _effect.run();
    var runner = _effect.run.bind(_effect);
    // so we can find runner's effect
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    runner.effect.stop();
}
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
function isTracking() {
    return activeEffect && shouldTrack;
}
function track(target, key) {
    if (!isTracking()) {
        return;
    }
    var depsMap = bucket.get(target);
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()));
    }
    var dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
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
var shallowReadonlyHandler = extend({}, readonlyHandler, {
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
        if (!isReadonly) {
            track(target, key);
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
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandler);
}
function createActiveObject(raw, handler) {
    return new Proxy(raw, handler);
}
function isReactive(observed) {
    return !!observed && !!observed[ReactiveFlags.isReactive];
}
function isReadonly(observed) {
    return !!observed && !!observed[ReactiveFlags.isReadonly];
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
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

function initSlots(instance, children) {
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 32 /* ShapeFlags.SLOTS_CHILDREN */) {
        normalizeObjectSlots(children, (instance.slots = {}));
    }
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

var RefImpl = /** @class */ (function () {
    function RefImpl(_value) {
        this.dep = new Set();
        this.__v_isRef = true;
        this._rawValue = _value;
        this._value = convert(_value);
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            if (hasChanged(this._rawValue, newValue)) {
                this._rawValue = newValue;
                this._value = convert(newValue);
                triggerEffects(this.dep);
            }
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
function ref(raw) {
    var refObj = new RefImpl(raw);
    return refObj;
}
function isRef(raw) {
    return !!(raw && raw.__v_isRef);
}
function unRef(raw) {
    return isRef(raw) ? raw.value : raw;
}
function proxyRefs(raw) {
    return new Proxy(raw, {
        get: function (target, key) {
            var value = Reflect.get(target, key);
            return unRef(value);
        },
        set: function (target, key, newValue) {
            var value = Reflect.get(target, key);
            if (isRef(value) && !isRef(newValue)) {
                return (value.value = newValue);
            }
            else {
                return Reflect.set(target, key, newValue);
            }
        },
    });
}

var ComputedImpl = /** @class */ (function () {
    function ComputedImpl(fn) {
        var _this = this;
        this._value = null;
        this._dirty = true;
        this._effect = new ReactiveEffect(fn, {
            scheduler: function () {
                _this._dirty = true;
            },
        });
    }
    Object.defineProperty(ComputedImpl.prototype, "value", {
        get: function () {
            if (this._dirty) {
                this._value = this._effect.run();
                this._dirty = false;
            }
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return ComputedImpl;
}());
function computed(fn) {
    return new ComputedImpl(fn);
}

function createComponentInstance(vnode, parent) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        emit: function () { },
        slots: {},
        parent: parent,
        provides: parent ? parent.provides : {},
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        setCurrentInstance(instance);
        var setupResult = setup(readonly(instance.props), {
            emit: instance.emit,
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (isObject(setupResult)) {
        // extends object
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}
var currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    // 基于 children 再次设置 shapeFlag
    normalizeChildren(vnode, children);
    return vnode;
}
function normalizeChildren(vnode, children) {
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 16 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= 8 /* ShapeFlags.TEXT_CHILDREN */;
    }
    if (vnode.shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag = vnode.shapeFlag | 32 /* ShapeFlags.SLOTS_CHILDREN */;
        }
    }
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
// 基于 type 来判断是什么类型的组件
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ShapeFlags.ELEMENT */
        : 4 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount: function (rootContainer) {
                var vnode = createVNode(rootComponent);
                render(vnode, rootContainer, null);
            },
        };
    };
}

function createRenderer(option) {
    var createElement = option.createElement, patchProps = option.patchProps, insert = option.insert;
    return {
        createApp: createAppApi(render),
    };
    function render(vnode, container, parent) {
        patch(vnode, container, parent);
    }
    function patch(vnode, container, parent) {
        var shapeFlag = vnode.shapeFlag, type = vnode.type;
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                    processElement(vnode, container, parent);
                }
                else if (shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) {
                    processComponent(vnode, container, parent);
                }
                break;
        }
    }
    function processElement(vnode, container, parent) {
        mountElement(vnode, container, parent);
    }
    function mountElement(vnode, container, parent) {
        // create Element
        var el = (vnode.el = createElement(vnode.type));
        var children = vnode.children, props = vnode.props;
        if (typeof children === "string") {
            el.textContent = children;
        }
        else if (Array.isArray(children)) {
            mountChildren(vnode, el, parent);
        }
        for (var key in props) {
            var val = props[key];
            // patch props
            patchProps(el, key, val);
        }
        // insert
        insert(container, el);
    }
    function mountChildren(vnode, container, parent) {
        vnode.children.forEach(function (item) {
            patch(item, container, parent);
        });
    }
    function processFragment(vnode, container, parent) {
        mountChildren(vnode, container, parent);
    }
    function processText(vnode, container) {
        var children = vnode.children;
        var textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processComponent(vnode, container, parent) {
        mountComponent(vnode, container, parent);
    }
    function mountComponent(vnode, container, parent) {
        var instance = createComponentInstance(vnode, parent);
        setupComponent(instance);
        setupRenderEffect(instance, vnode, container);
    }
    function setupRenderEffect(instance, vnode, container) {
        // const subTree = instance.render.call(instance.setupState);
        // TODO maybe sometime don't need this if
        if (instance.render) {
            var subTree = instance.render.call(instance.proxy);
            patch(subTree, container, instance);
            vnode.el = subTree.el;
        }
    }
}

var h = createVNode;

function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot && typeof slot === "function") {
        return createVNode(Fragment, {}, slot(props));
    }
}

function provide(key, value) {
    var _a;
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    var _a, _b;
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (!parentProvides) {
            return;
        }
        if (key in parentProvides) {
            return (_b = currentInstance.parent) === null || _b === void 0 ? void 0 : _b.provides[key];
        }
        else if (defaultValue !== undefined) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            else {
                return defaultValue;
            }
        }
    }
}

function createElement(type) {
    return document.createElement(type);
}
function patchProps(el, key, val) {
    var reg = /^on[A-Z]/;
    if (key.match(reg)) {
        var eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, val);
    }
    else {
        el.setAttribute(key, val);
    }
}
function insert(container, element) {
    container.appendChild(element);
}
function createApp(args) {
    var renderer = createRenderer({
        createElement: createElement,
        patchProps: patchProps,
        insert: insert,
    });
    return renderer.createApp(args);
}

exports.computed = computed;
exports.createApp = createApp;
exports.createElement = createElement;
exports.createTextVNode = createTextVNode;
exports.effect = effect;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.insert = insert;
exports.isProxy = isProxy;
exports.isReactive = isReactive;
exports.isReadonly = isReadonly;
exports.isRef = isRef;
exports.patchProps = patchProps;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.renderSlots = renderSlots;
exports.shallowReadonly = shallowReadonly;
exports.stop = stop;
exports.unRef = unRef;
