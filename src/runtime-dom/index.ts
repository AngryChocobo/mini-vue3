import { createRender } from "../runtime-core/renderer";

export function createElement(type) {
  return document.createElement(type);
}

export function patchProps(el, key, val) {
  const reg = /^on[A-Z]/;
  if (key.match(reg)) {
    const eventName = key.slice(2).toLowerCase();
    el.addEventListener(eventName, val);
  } else {
    el.setAttribute(key, val);
  }
}

export function insert(container, element) {
  container.appendChild(element);
}

export const { render } = createRender({
  createElement: createElement,
  patchProps: patchProps,
  insert: insert,
});
