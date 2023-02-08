import { ReactiveEffect } from "../reactivity/effect";

export function watchEffect(fn: Function) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
