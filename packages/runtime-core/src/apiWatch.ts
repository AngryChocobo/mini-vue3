import { ReactiveEffect } from "reactivity";

export function watchEffect(fn: () => void) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
