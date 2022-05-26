const bucket = new Map();
let activeEffect;

class ReactiveEffect {
  constructor(private fn) {
    //
  }
  run() {
    this.fn();
  }
}
export function effect(fn) {
  activeEffect = fn;
  const _effect = new ReactiveEffect(fn);
  _effect.run();
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
