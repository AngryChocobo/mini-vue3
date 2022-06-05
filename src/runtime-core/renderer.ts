import { ShapeFlags } from "../shared/shapeFlags";
import {
  ComponentInternalInstance,
  createComponentInstance,
  setupComponent,
} from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text, VNode, VNodeArrayChildren } from "./vnode";

export function createRenderer(option) {
  const { createElement, patchProps, insert } = option;
  return {
    createApp: createAppApi(render),
  };
  function render(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    patch(vnode, container, parent);
  }

  function patch(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    const { shapeFlag, type } = vnode;

    switch (type) {
      case Fragment:
        processFragment(vnode, container, parent);
        break;

      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parent);
        }
        break;
    }
  }

  function processElement(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    mountElement(vnode, container, parent);
  }

  function mountElement(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    // create Element
    const el = (vnode.el = createElement(vnode.type as string));
    const { children, props } = vnode;

    if (typeof children === "string") {
      el.textContent = children;
    } else if (Array.isArray(children)) {
      mountChildren(vnode, el, parent);
    }

    for (const key in props) {
      const val = props[key];
      // patch props
      patchProps(el, key, val);
    }
    // insert
    insert(container, el);
  }

  function mountChildren(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    (vnode.children as VNodeArrayChildren).forEach((item) => {
      patch(item, container, parent);
    });
  }

  function processFragment(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    mountChildren(vnode, container, parent);
  }

  function processText(vnode: VNode, container: HTMLElement) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(
      children as string
    ) as any);
    container.append(textNode);
  }

  function processComponent(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    mountComponent(vnode, container, parent);
  }

  function mountComponent(
    vnode: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    const instance = createComponentInstance(vnode, parent);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
  }

  function setupRenderEffect(
    instance: ComponentInternalInstance,
    vnode: VNode,
    container: HTMLElement
  ) {
    // const subTree = instance.render.call(instance.setupState);
    // TODO maybe sometime don't need this if
    if (instance.render) {
      const subTree = instance.render.call(instance.proxy);
      patch(subTree, container, instance);

      vnode.el = subTree.el;
    }
  }
}
