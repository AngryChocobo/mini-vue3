import { isObject } from "../utils";
import { track, trigger } from "./effect";
import { reactive, readonly, ReactiveFlags } from "./reactive";

const get = createGetter();
const set = createSetter();
export const mutableHandler = {
  get: get,
  set: set,
};

const readonlyGet = createGetter(true);

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`set readonly target key: ${key} failed`, target);
    return target[key];
  },
};

function createGetter(isReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.isReactive) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.isReadonly) {
      return isReadonly;
    }
    const res = target[key];
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
