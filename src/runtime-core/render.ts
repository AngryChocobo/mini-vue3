import { isObject } from "../utils/index";
import {
  ComponentInternalInstance,
  createComponentInstance,
  setupComponent,
} from "./component";
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
    patch(subTree, container);

    vnode.el = subTree.el;
  }
}

function processElement(vnode: VNode, container: HTMLElement) {
  const el = (vnode.el = document.createElement(vnode.type as string));
  const { children, props } = vnode;

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
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
function mountChildren(vnode: VNode, container: HTMLElement) {
  (vnode.children as VNodeArrayChildren).forEach((item) => {
    patch(item, container);
  });
}
