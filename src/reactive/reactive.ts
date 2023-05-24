import { activeEffect } from "./effect";

const bucket = new WeakMap<object, Map<string, Set<Function>>>();

export function reactive<T extends object>(obj: T) {
  const proxyObj = new Proxy(obj, {
    get(target, key) {
      trackEffect(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      triggerEffect(target, key);
      return true;
    },
  });
  return proxyObj;
}

function trackEffect(obj, key) {
  let depsMap = bucket.get(obj);
  if (!depsMap) {
    bucket.set(obj, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

function triggerEffect(obj, key) {
  const deps = bucket.get(obj).get(key);
  deps.forEach((effect) => {
    effect();
  });
}
