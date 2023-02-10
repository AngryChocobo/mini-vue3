import { ShapeFlags } from "shared";
import { RendererElement } from "./renderer";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export type VNodeTypes = string | typeof Text | typeof Fragment;
export type VNode = {
  type: VNodeTypes;
  props: any;
  children: string | VNodeArrayChildren;
  el: null | RendererElement;
  shapeFlag: number;
};

export type VNodeArrayChildren = any[];

export function createVNode(type: VNodeTypes, props?, children?) {
  const vnode: VNode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  };
  // 基于 children 再次设置 shapeFlag

  normalizeChildren(vnode, children);

  return vnode;
}

export function normalizeChildren(vnode: VNode, children) {
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOTS_CHILDREN;
    }
  }
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}
// 基于 type 来判断是什么类型的组件
function getShapeFlag(type: VNodeTypes) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
