import { def } from "shared";
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
  [ReactiveFlags.RAW]?: unknown;
}

export function reactive<T extends object>(raw: T) {
  return createActiveObject(raw, mutableHandler);
}

export function readonly<T extends object>(raw: T) {
  return createActiveObject(raw, readonlyHandler);
}

export function shallowReadonly<T extends object>(raw: T) {
  return createActiveObject(raw, shallowReadonlyHandler);
}

function createActiveObject<T extends object>(
  raw: T,
  handler: ProxyHandler<T>
) {
  return new Proxy(raw, handler);
}

export function isReactive(observed: unknown) {
  return !!observed && !!observed[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(observed: unknown) {
  return !!observed && !!observed[ReactiveFlags.IS_READONLY];
}
export function isProxy(value: unknown) {
  return isReactive(value) || isReadonly(value);
}

export function markRaw<T extends object>(raw: T) {
  def(raw, ReactiveFlags.SKIP, true);
  return raw;
}
