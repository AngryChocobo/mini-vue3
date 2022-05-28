import {
  mutableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandler";

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

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandler);
}

function createActiveObject(raw, handler) {
  return new Proxy(raw, handler);
}

export function isReactive(observed) {
  return !!observed && !!observed[ReactiveFlags.isReactive];
}

export function isReadonly(observed) {
  return !!observed && !!observed[ReactiveFlags.isReadonly];
}
