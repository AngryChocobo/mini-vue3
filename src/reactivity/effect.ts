const bucket = new Map();
let activeEffect;

class ReactiveEffect {
  constructor(private fn) {
    //
  }
  run() {
    activeEffect = this.fn;
    return this.fn();
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  return _effect.run.bind(_effect);
}

export function trigger(obj: any, key: string | symbol) {
  let depMap = bucket.get(obj);
  if (!depMap) return;
  const deps = depMap.get(key);
  if (!deps) return;
  deps.forEach((dep) => dep());
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
