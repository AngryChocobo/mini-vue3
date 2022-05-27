import { track, trigger } from "./effect";

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
    const res = target[key];
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
