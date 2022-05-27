import { mutableHandler, readonlyHandler } from "./baseHandler";

export const ReactiveFlags = {
  isReactive: Symbol("isReactive"),
  isReadonly: Symbol("isReadonly"),
};

export function reactive(raw) {
  return createActiveObject(raw, mutableHandler);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandler);
}

function createActiveObject(raw, handler) {
  return new Proxy(raw, handler);
}

export function isReactive(observed) {
  return !!observed[ReactiveFlags.isReactive];
}

export function isReadonly(observed) {
  return !!observed[ReactiveFlags.isReadonly];
}
