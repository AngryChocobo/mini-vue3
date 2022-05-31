import { isObject } from "../utils/index";
import { patch } from "./render";
import { VNode } from "./vnode";

export type ComponentInternalInstance = {
  vnode: VNode;
  type: VNode["type"];
  setupState: any;
  proxy?: any;
  render?: Function;
};

export function createComponentInstance(vnode: VNode) {
  const component: ComponentInternalInstance = {
    vnode,
    type: vnode.type,
    setupState: {},
  };
  return component;
}
export function setupComponent(instance: ComponentInternalInstance) {
  // initProps();
  // initSlot();
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: ComponentInternalInstance) {
  const Component = instance.vnode.type;
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const { setupState } = instance;
        if (key in setupState) {
          return setupState[key];
        }
        if (key === "$el") {
          return instance.vnode.el;
        }
      },
    }
  );
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: any
) {
  if (isObject(setupResult)) {
    // extends object
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: ComponentInternalInstance) {
  const Component = instance.vnode.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

function initProps() {
  throw new Error("Function not implemented.");
}

function initSlot() {
  throw new Error("Function not implemented.");
}
