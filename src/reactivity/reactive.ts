import { def } from "../shared";
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

export interface Target {
  [ReactiveFlags.SKIP]?: boolean;
  [ReactiveFlags.IS_REACTIVE]?: boolean;
  [ReactiveFlags.IS_READONLY]?: boolean;
  [ReactiveFlags.RAW]?: any;
}

export function reactive(raw: any) {
  return createActiveObject(raw, mutableHandler);
}

export function readonly(raw: any) {
  return createActiveObject(raw, readonlyHandler);
}

export function shallowReadonly(raw: any) {
  return createActiveObject(raw, shallowReadonlyHandler);
}

function createActiveObject(raw: any, handler) {
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

export function markRaw<T extends object>(raw: T) {
  def(raw, ReactiveFlags.SKIP, true);
  return raw;
}
