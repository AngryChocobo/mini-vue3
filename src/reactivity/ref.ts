import { isTracking, trackEffects, triggerEffects } from "./effect";
import { hasChanged, isObject } from "../utils";
import { reactive } from "./reactive";

class RefImpl {
  dep = new Set();
  __v_isRef = true;
  private _value: any;
  private _rawValue: any;
  constructor(_value) {
    this._rawValue = _value;
    this._value = convert(_value);
  }

  get value() {
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

export function trackRefValue(ref: RefImpl) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}
export function ref(raw) {
  const refObj = new RefImpl(raw);
  return refObj;
}
export function isRef(raw) {
  return !!raw && !!raw.__v_isRef;
}
export function unRef(raw) {
  return isRef(raw) ? raw.value : raw;
}
