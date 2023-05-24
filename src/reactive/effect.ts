export let activeEffect;

export function effect(fn: (...args: unknown[]) => void) {
  activeEffect = fn;
  fn();
}
