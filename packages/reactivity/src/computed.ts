import { ReactiveEffect } from "./effect";

class ComputedImpl<T> {
  private _value!: T;
  private _dirty = true;
  private _effect: ReactiveEffect;
  constructor(fn) {
    this._effect = new ReactiveEffect(fn, () => {
      this._dirty = true;
    });
  }
  get value() {
    if (this._dirty) {
      this._value = this._effect.run();
      this._dirty = false;
    }
    return this._value;
  }
}

export function computed(fn) {
  return new ComputedImpl(fn);
}
