const bucket = new Map();
let activeEffect;
let shouldTrack = true;

type ReactiveEffectOptions = {
  onStop?: Function;
  scheduler?: Function;
};

export class ReactiveEffect {
  active = true;
  deps = [];
  scheduler: Function | undefined;
  onStop: Function | undefined;
  constructor(private fn, options?: ReactiveEffectOptions) {
    this.scheduler = options?.scheduler;
    this.onStop = options?.onStop;
  }
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

function cleanup(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  // so we can find runner's effect
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

export function trigger(target: any, key: string | symbol) {
  let depsMap = bucket.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  if (!deps) return;
  triggerEffects(deps);
}

export function triggerEffects(deps: Set<ReactiveEffect>) {
  deps.forEach((dep) => {
    if (dep?.scheduler) {
      dep.scheduler();
    } else {
      dep.run();
    }
  });
}

export function isTracking() {
  return activeEffect && shouldTrack;
}

export function track(target: any, key: string | symbol) {
  if (!isTracking()) {
    return;
  }
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  trackEffects(dep);
}

export function trackEffects(dep: Set<any>) {
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
