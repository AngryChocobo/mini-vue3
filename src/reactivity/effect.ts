const bucket = new Map();
let activeEffect;

class ReactiveEffect {
  deps = [];
  constructor(private fn, private options?) {}
  run() {
    activeEffect = this;
    return this.fn();
  }
  stop() {
    cleanup(this);
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
  deps.forEach((dep) => {
    if (dep.options?.scheduler) {
      dep.options.scheduler();
    } else {
      dep.run();
    }
  });
}
export function track(target: any, key: string | symbol) {
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
