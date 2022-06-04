import { ShapeFlags } from "../shared/shapeFlags";
import {
  ComponentInternalInstance,
  createComponentInstance,
  setupComponent,
} from "./component";
import { Fragment, Text, VNode, VNodeArrayChildren } from "./vnode";

export function render(
  vnode: VNode,
  container: HTMLElement,
  parent: ComponentInternalInstance | null
) {
  patch(vnode, container, parent);
}

export function patch(
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

function processElement(
  vnode: VNode,
  container: HTMLElement,
  parent: ComponentInternalInstance | null
) {
  const el = (vnode.el = document.createElement(vnode.type as string));
  const { children, props } = vnode;

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el, parent);
  }

  for (const key in props) {
    const reg = /^on[A-Z]/;
    if (key.match(reg)) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  }

  container.appendChild(el);
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
