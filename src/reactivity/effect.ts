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

export function trigger(obj: any, key: string | symbol) {
  let depMap = bucket.get(obj);
  if (!depMap) return;
  const deps = depMap.get(key);
  if (!deps) return;
  deps.forEach((dep) => {
    if (dep.options?.scheduler) {
      dep.options.scheduler();
    } else {
      dep.run();
    }
  });
}
export function track(obj: any, key: string | symbol) {
  let depMap = bucket.get(obj);
  if (!depMap) {
    bucket.set(obj, (depMap = new Map()));
  }
  let deps = depMap.get(key);
  if (!deps) {
    depMap.set(key, (deps = []));
  }
  deps.push(activeEffect);
}
