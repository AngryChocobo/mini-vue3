import { effect } from "./effect";
import { trackEffect, triggerEffect } from "./reactive";

export function computed<T extends (...args: unknown[]) => unknown>(fn: T) {
  const effectFn = effect(fn, {
    lazy: true,
    scheduler() {
      dirty = true;
      triggerEffect(obj, "value");
    },
  });
  let cachedValue;
  let dirty = true;
  const obj = {
    get value() {
      if (dirty) {
        cachedValue = effectFn();
        dirty = false;
      }
      trackEffect(obj, "value");
      return cachedValue;
    },
  };
  return obj;
}
