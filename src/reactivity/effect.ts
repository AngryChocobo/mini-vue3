import { extend } from "../shared";
import { Target } from "./reactive";

type Dep = Set<ReactiveEffect>;
type KeyToDepMap = Map<any, Dep>;
const targetMap = new Map<any, KeyToDepMap>();

let activeEffect: ReactiveEffect | null = null;
let shouldTrack = true;

type ReactiveEffectOptions = {
  onStop?: () => void;
  scheduler?: EffectScheduler;
};
export type EffectScheduler = (...args: any[]) => any;
export class ReactiveEffect {
  active = true;
  deps: Dep[] = [];
  onStop?: () => void;
  constructor(public fn, public scheduler?: EffectScheduler) {}
  run() {
    if (!this.active) {
      return this.fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const result = this.fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    shouldTrack = false;
    if (this.active) {
      cleanup(this);
      this.active = false;
      if (this?.onStop) {
        this.onStop();
      }
    }
  }
}

function cleanup(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

export function effect(fn, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  _effect.run();
  // extends onStop to _effect if exist
  extend(_effect, options);
  const runner: any = _effect.run.bind(_effect);
  // so we can find runner's effect
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

export function trigger(target: Target, key: string | symbol) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  if (!deps) return;
  triggerEffects(deps);
}

export function triggerEffects(dep: Dep) {
  dep.forEach((effect) => {
    if (effect?.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}

export function isTracking() {
  return activeEffect && shouldTrack;
}

export function track(target: Target, key: string | symbol) {
  if (!isTracking()) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  trackEffects(dep);
}

export function trackEffects(dep: Dep) {
  if (activeEffect) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
