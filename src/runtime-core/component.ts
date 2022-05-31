import { isObject } from "../utils/index";
import { patch } from "./render";

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };
  return component;
}
export function setupComponent(instance: { vnode: any }, container) {
  // initProps();
  // initSlot();
  setupStatefulComponent(instance);
  setupRenderEffect(instance, container);
}

function setupStatefulComponent(instance: any) {
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

function handleSetupResult(instance, setupResult: any) {
  if (isObject(setupResult)) {
    // extends object
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.vnode.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

function setupRenderEffect(instance: any, container) {
  // const subTree = instance.render.call(instance.setupState);
  const subTree = instance.render.call(instance.proxy);
  patch(subTree, container);
}

function initProps() {
  throw new Error("Function not implemented.");
}

function initSlot() {
  throw new Error("Function not implemented.");
}
