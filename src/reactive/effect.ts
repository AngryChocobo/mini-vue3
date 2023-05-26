export let activeEffect: Effect | null = null;
const effectStack: Effect[] = [];

// export type Effect = (fn: (...args: unknown[]) => void) => void;
export interface Effect {
  (...args: unknown[]): unknown;
  deps: Set<Effect>[];
  options: EffectOptions;
}

type EffectOptions = {
  scheduler?: (fn: (...args: unknown[]) => void) => void;
  lazy?: boolean;
};

export function effect(fn, options: EffectOptions = {}) {
  activeEffect = fn;
  const effectFn: Effect = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const value = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return value;
  };
  effectFn.deps = [];
  effectFn.options = options;
  if (!options.lazy) {
    effectFn();
  }
  // can manually call
  return effectFn;
}

function cleanup(effectFn: Effect) {
  effectFn.deps.forEach((dep) => {
    dep.delete(effectFn);
  });
  effectFn.deps.length = 0;
}
