import { isObject } from "shared";
import { VNode } from "./vnode";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { readonly, proxyRefs } from "reactivity";
import { emit } from "./componentEmit";
import { initSlots, Slots } from "./componentSlots";
import { ComponentOptions } from "./componentOptions";

export type Data = Record<string, unknown>;

export type ComponentInternalInstance = {
  vnode: VNode;
  type: VNode["type"];
  setupState: Data;
  emit: (eventName: string) => void;
  slots: Slots;
  proxy?: any;
  render?: () => any;
  props?: any;
  parent: ComponentInternalInstance | null;
  provides: Data;
  isMounted: boolean;
  subTree: any;
};

export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null
) {
  const component: ComponentInternalInstance = {
    vnode,
    type: vnode.type,
    setupState: {},
    emit: () => {},
    slots: {},
    parent,
    provides: parent ? parent.provides : {},
    isMounted: false,
    subTree: null,
  };
  component.emit = emit.bind(null, component);
  return component;
}

export function setupComponent(instance: ComponentInternalInstance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: ComponentInternalInstance) {
  const Component = instance.type as ComponentOptions;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(readonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: ComponentInternalInstance, setupResult) {
  if (isObject(setupResult)) {
    // extends object
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: ComponentInternalInstance) {
  const Component = instance.type as ComponentOptions;
  if (Component.render) {
    instance.render = Component.render;
  }
}

let currentInstance: ComponentInternalInstance | null = null;
export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance: ComponentInternalInstance | null) {
  currentInstance = instance;
}
