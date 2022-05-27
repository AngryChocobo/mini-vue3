const bucket = new Map();
let activeEffect;

class ReactiveEffect {
  constructor(private fn, private options?) {
    //
  }
  run() {
    activeEffect = this;
    return this.fn();
  }
}
export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn, options);
  _effect.run();
  return _effect.run.bind(_effect);
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
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = []));
  }
  deps.push(activeEffect);
}
