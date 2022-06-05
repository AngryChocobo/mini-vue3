import { effect } from "../reactivity";
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
    patch(null, vnode, container, parent);
  }

  function patch(
    n1: VNode | null,
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n2, container, parent);
        break;

      case Text:
        processText(n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n2, container, parent);
        }
        break;
    }
  }

  function processElement(
    n1: VNode | null,
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    if (n1) {
      patchElement(n1, n2, container, parent);
    } else {
      mountElement(n2, container, parent);
    }
  }

  function patchElement(
    n1: VNode | null,
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);
  }
  function mountElement(
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    // create Element
    const el = (n2.el = createElement(n2.type as string));
    const { children, props } = n2;

    if (typeof children === "string") {
      el.textContent = children;
    } else if (Array.isArray(children)) {
      mountChildren(n2, el, parent);
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
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    (n2.children as VNodeArrayChildren).forEach((item) => {
      patch(null, item, container, parent);
    });
  }

  function processFragment(
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    mountChildren(n2, container, parent);
  }

  function processText(n2: VNode, container: HTMLElement) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(
      children as string
    ) as any);
    container.append(textNode);
  }

  function processComponent(
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    mountComponent(n2, container, parent);
  }

  function mountComponent(
    n2: VNode,
    container: HTMLElement,
    parent: ComponentInternalInstance | null
  ) {
    const instance = createComponentInstance(n2, parent);
    setupComponent(instance);
    setupRenderEffect(instance, n2, container);
  }

  function setupRenderEffect(
    instance: ComponentInternalInstance,
    vnode: VNode,
    container: HTMLElement
  ) {
    effect(() => {
      // TODO maybe sometime don't need this if
      if (!instance.render) {
        return;
      }
      if (instance.isMounted) {
        const subTree = instance.render.call(instance.proxy);
        const { subTree: preSubTree } = instance;
        console.log("update");
        console.log("update pre", preSubTree);
        console.log("update current", subTree);
        instance.subTree = subTree;
        patch(preSubTree, subTree, container, instance);
      } else {
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        patch(null, subTree, container, instance);

        vnode.el = subTree.el;
        instance.isMounted = true;
      }
    });
  }
}
