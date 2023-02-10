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

type GetData<T extends object> = {
  [key in keyof T]: T[key];
};

export function reactive<T extends object>(raw: T): GetData<T>;
export function reactive(raw: object) {
  return createReactiveObject(raw, mutableHandler);
}

function createReactiveObject<T extends object>(
  raw: T,
  handler: ProxyHandler<any>
) {
  return new Proxy(raw, handler);
}

export function readonly<T extends object>(raw: T): GetData<T>;
export function readonly(raw: object) {
  return createReactiveObject(raw, readonlyHandler);
}

export function shallowReadonly<T extends object>(raw: T): Readonly<T> {
  return createReactiveObject(raw, shallowReadonlyHandler);
}

export function isReactive(observed: any) {
  return !!observed && !!observed[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(observed: any) {
  return !!observed && !!observed[ReactiveFlags.IS_READONLY];
}
export function isProxy(value: unknown) {
  return isReactive(value) || isReadonly(value);
}

export function markRaw<T extends object>(raw: T) {
  def(raw, ReactiveFlags.SKIP, true);
  return raw;
}
