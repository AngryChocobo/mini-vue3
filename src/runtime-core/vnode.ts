export type VNode = {
  type: any;
  props: any;
  children: string | VNodeArrayChildren;
  el: null | HTMLElement;
};

export type VNodeArrayChildren = any[];

export function createVNode(type, props?, children?) {
  const vnode: VNode = {
    type,
    props,
    children,
    el: null,
  };
  return vnode;
}
