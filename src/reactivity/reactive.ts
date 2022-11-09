import {
  mutableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandler";

export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

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
  return !!observed && !!observed[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(observed) {
  return !!observed && !!observed[ReactiveFlags.IS_READONLY];
}
export function isProxy(value: unknown) {
  return isReactive(value) || isReadonly(value);
}
