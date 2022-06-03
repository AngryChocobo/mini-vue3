import { ComponentInternalInstance } from "./component";

export function initSlot(instance: ComponentInternalInstance, children) {
  instance.slots = Array.isArray(children) ? children : [children];
}
