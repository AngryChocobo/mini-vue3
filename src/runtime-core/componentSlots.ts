import { ShapeFlags } from "../shared/shapeFlags";
import { ComponentInternalInstance } from "./component";

export function initSlots(instance: ComponentInternalInstance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, (instance.slots = {}));
  }
}

function normalizeObjectSlots(children: any, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
