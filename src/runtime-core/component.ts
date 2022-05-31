import { isObject } from "../utils/index";
import { patch } from "./render";
import { VNode } from "./vnode";

type ComponentInternalInstance = {
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
export function setupComponent(
  instance: ComponentInternalInstance,
  container: HTMLElement
) {
  // initProps();
  // initSlot();
  setupStatefulComponent(instance);
  setupRenderEffect(instance, container);
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

function setupRenderEffect(
  instance: ComponentInternalInstance,
  container: HTMLElement
) {
  // const subTree = instance.render.call(instance.setupState);
  // TODO maybe sometime don't need this if
  if (instance.render) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);
  }
}

function initProps() {
  throw new Error("Function not implemented.");
}

function initSlot() {
  throw new Error("Function not implemented.");
}
