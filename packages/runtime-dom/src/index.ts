import { createRenderer } from "../runtime-core/renderer";
export * from "../runtime-core";

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

export function createApp(args) {
  const renderer = createRenderer({
    createElement,
    patchProps,
    insert,
  });

  return renderer.createApp(args);
}
