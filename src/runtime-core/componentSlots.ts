import { ComponentInternalInstance } from "./component";

export function initSlot(instance: ComponentInternalInstance, children) {
  instance.slots = children;
}
