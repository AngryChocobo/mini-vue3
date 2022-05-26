const bucket = new Map();
let activeEffect;

export function reactive(raw) {
  const reactiveObj = new Proxy(raw, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(target, key);
      return true;
    },
  });
  return reactiveObj;
}

export function effect(fn) {
  activeEffect = fn;
  fn();
}

function trigger(obj: any, key: string | symbol) {
  let depMap = bucket.get(obj);
  if (!depMap) return;
  const deps = depMap.get(key);
  if (!deps) return;
  deps.forEach((dep) => dep());
}
function track(obj: any, key: string | symbol) {
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
