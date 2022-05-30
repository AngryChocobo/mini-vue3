import { ReactiveEffect } from "./effect";

class ComputedImpl {
  private _value: any = null;
  private _dirty = true;
  private _effect: ReactiveEffect;
  constructor(fn) {
    this._effect = new ReactiveEffect(fn, {
      scheduler: () => {
        this._dirty = true;
      },
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
export function computed(fn: Function) {
  return new ComputedImpl(fn);
}
