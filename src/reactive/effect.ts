export let activeEffect: Effect | null = null;
const effectStack: Effect[] = [];

// export type Effect = (fn: (...args: unknown[]) => void) => void;
export interface Effect {
  (...args: unknown[]): void;
  deps: Set<Effect>[];
}

export function effect(fn) {
  activeEffect = fn;
  const effectFn: Effect = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn: Effect) {
  effectFn.deps.forEach((dep) => {
    dep.delete(effectFn);
  });
  effectFn.deps.length = 0;
}
