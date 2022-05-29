import { isTracking, trackEffects, triggerEffects } from "./effect";
import { hasChanged, isObject } from "../utils";
import { reactive } from "./reactive";

type Ref<T = any> = {
  value: T;
};

type RefBase<T> = {
  dep?: any;
  value: T;
};

class RefImpl<T> {
  dep = new Set();
  private __v_isRef = true;
  private _value: T;
  private _rawValue: T;
  constructor(_value: T) {
    this._rawValue = _value;
    this._value = convert(_value);
  }

  get value(): T {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function trackRefValue(ref: RefBase<any>) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function ref<T>(raw: T) {
  const refObj = new RefImpl(raw);
  return refObj;
}

export function isRef<T>(raw: Ref<T> | any): raw is Ref<T> {
  return !!(raw && raw.__v_isRef);
}

export function unRef<T>(raw: Ref<T> | T) {
  return isRef(raw) ? raw.value : raw;
}

export function proxyRefs(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const value = Reflect.get(target, key);
      return unRef(value);
    },
    set(target, key, newValue) {
      const value = Reflect.get(target, key);
      if (isRef(value) && !isRef(newValue)) {
        return (value.value = newValue);
      } else {
        return Reflect.set(target, key, newValue);
      }
    },
  });
}
