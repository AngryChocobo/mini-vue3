import { isObject, extend } from "../utils";
import { track, trigger } from "./effect";
import { reactive, readonly, ReactiveFlags } from "./reactive";

const get = createGetter();
const set = createSetter();
export const mutableHandler = {
  get: get,
  set: set,
};

const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`set readonly target key: ${key} failed`, target);
    return target[key];
  },
};

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGet,
});

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = target[key];
    if (isShallow) {
      return res;
    }
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
