import { isObject } from "../utils/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

export function patch(vnode: any, container: any) {
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else {
    processElement(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance, container);
}

function processElement(vnode: any, container: HTMLElement) {
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
function mountedChildren(vnode: any, container: HTMLElement) {
  vnode.children.forEach((item) => {
    patch(item, container);
  });
}
