import { track, trigger } from "./effect";

export function reactive(raw) {
  const reactiveObj = new Proxy(raw, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(target, key);
      return true;
    },
  });
  return reactiveObj;
}
