import { type Effect, activeEffect } from "./effect";

const bucket = new WeakMap<object, Map<string, Set<Effect>>>();

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
  if (!activeEffect) {
    return;
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function triggerEffect(obj, key) {
  const deps = bucket.get(obj).get(key);
  if (!deps) {
    return;
  }
  /**
   * ⚠️ The next line code will inifinite loop.We must avoid.
   * const _deps = deps;
   */
  const _deps = [...deps];
  _deps.forEach((effectFn) => {
    // fix RangeError: Maximum call stack size exceeded
    if (effectFn !== activeEffect) {
      if (effectFn.options?.scheduler) {
        effectFn.options.scheduler(effectFn);
      } else {
        effectFn();
      }
    }
  });
}
