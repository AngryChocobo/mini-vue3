import { isTracking, trackDep, triggerDep } from "./effect";

class RefImpl {
  dep = new Set();
  constructor(private data) {
    //
  }
  get value() {
    if (isTracking()) {
      trackDep(this.dep);
    }
    return this.data;
  }
  set value(newValue) {
    this.data = newValue;
    triggerDep(this.dep);
  }
}

export function ref(raw) {
  const refObj = new RefImpl(raw);
  return refObj;
}
