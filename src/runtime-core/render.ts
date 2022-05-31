import { isObject } from "../utils/index";
import { createComponentInstance, setupComponent } from "./component";
import { VNode, VNodeArrayChildren } from "./vnode";

export function render(vnode: VNode, container: HTMLElement) {
  patch(vnode, container);
}

export function patch(vnode: VNode, container: HTMLElement) {
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else {
    processElement(vnode, container);
  }
}

function processComponent(vnode: VNode, container: HTMLElement) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: VNode, container: HTMLElement) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance, container);
}

function processElement(vnode: VNode, container: HTMLElement) {
  const el = document.createElement(vnode.type as string);
  const { children, props } = vnode;

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountedChildren(vnode, el);
  }

  for (const key in props) {
    el.setAttribute(key, props[key]);
  }

  container.appendChild(el);
}
function mountedChildren(vnode: VNode, container: HTMLElement) {
  (vnode.children as VNodeArrayChildren).forEach((item) => {
    patch(item, container);
  });
}
