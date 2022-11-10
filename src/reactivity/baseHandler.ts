import { isObject, extend } from "../utils";
import { track, trigger } from "./effect";
import { reactive, readonly, ReactiveFlags, Target } from "./reactive";

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

function isSKIP(target: Target) {
  return target[ReactiveFlags.SKIP];
}
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
    // 即使是一个markRow的对象也需要先把依赖收集着，因为后边可能就不需要markRow了，不能把依赖给丢掉
    if (!isReadonly) {
      track(target, key);
    }
    // markRow之后就不需要再继续reative了
    if (isObject(res)) {
      if (isSKIP(res)) {
        return res;
      }
      return isReadonly ? readonly(res) : reactive(res);
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
