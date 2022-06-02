import { isObject } from "../utils/index";
import { VNode } from "./vnode";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { readonly } from "../reactivity/reactive";

export type ComponentInternalInstance = {
  vnode: VNode;
  type: VNode["type"];
  setupState: any;
  proxy?: any;
  render?: Function;
  props?: any;
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
  initProps(instance);
  // initSlot();
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: ComponentInternalInstance) {
  const Component = instance.type;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(readonly(instance.props), { emit: "awd" });
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
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

function initSlot() {
  throw new Error("Function not implemented.");
}
