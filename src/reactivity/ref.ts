import { isTracking, trackEffects, triggerEffects } from "./effect";

class RefImpl {
  dep = new Set();
  constructor(private data) {
    //
  }
  get value() {
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this.data;
  }
  set value(newValue) {
    this.data = newValue;
    triggerEffects(this.dep);
  }
}

export function ref(raw) {
  const refObj = new RefImpl(raw);
  return refObj;
}
