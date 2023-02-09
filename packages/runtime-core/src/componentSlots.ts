import { ShapeFlags } from "shared";
import { ComponentInternalInstance } from "./component";
import { VNode } from "./vnode";

export type Slot = (...args: unknown[]) => VNode[];

export type InternalSlots = {
  [name: string]: Slot | undefined;
};

export type Slots = Readonly<InternalSlots>;

export function initSlots(instance: ComponentInternalInstance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, (instance.slots = {}));
  }
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
