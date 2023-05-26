import { effect } from "./effect";

export function computed<T extends (...args: unknown[]) => unknown>(fn: T) {
  const effectFn = effect(fn, {
    lazy: true,
    scheduler() {
      dirty = true;
    },
  });
  let cachedValue;
  let dirty = true;
  return {
    get value() {
      if (dirty) {
        cachedValue = effectFn();
        dirty = false;
      }
      return cachedValue;
    },
  };
}
