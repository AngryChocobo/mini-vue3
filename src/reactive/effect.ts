export let activeEffect: Effect | null = null;

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
    fn();
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
