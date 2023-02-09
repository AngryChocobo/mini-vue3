import { markRaw } from "reactivity";

export const enum NodeTypes {
  TEXT = "text",
  ELEMENT = "element",
  COMMENT = "comment",
}

export type TestNode = TestElement | TestText | TestComment;

export interface TestText {
  id: number;
  type: NodeTypes.TEXT;
  parentNode: TestElement | null;
  text: string;
}

export interface TestComment {
  id: number;
  type: NodeTypes.COMMENT;
  parentNode: TestElement | null;
  text: string;
}

export interface TestElement {
  id: number;
  type: NodeTypes.ELEMENT;
  parentNode: TestElement | null;
  tag: string;
  children: TestNode[];
  props: Record<string, unknown>;
  eventListeners: Record<string, () => unknown | (() => unknown)[]> | null;
}

let nodeId = 0;

export function createElement(tag: string): TestElement {
  const node: TestElement = {
    id: nodeId++,
    type: NodeTypes.ELEMENT,
    tag,
    children: [],
    props: {},
    parentNode: null,
    eventListeners: null,
  };
  // avoid test nodes from being observed
  markRaw(node);
  return node;
}

export function insert(
  child: TestNode,
  parent: TestElement,
  ref?: TestNode | null
) {
  let refIndex;
  if (ref) {
    refIndex = parent.children.indexOf(ref);
    if (refIndex === -1) {
      console.error("ref: ", ref);
      console.error("parent: ", parent);
      throw new Error("ref is not a child of parent");
    }
  }
  // remove the node first, but don't log it as a REMOVE op
  remove(child);
  // re-calculate the ref index because the child's removal may have affected it
  refIndex = ref ? parent.children.indexOf(ref) : -1;
  if (refIndex === -1) {
    parent.children.push(child);
    child.parentNode = parent;
  } else {
    parent.children.splice(refIndex, 0, child);
    child.parentNode = parent;
  }
}

export function remove(child: TestNode) {
  const parent = child.parentNode;
  if (parent) {
    const i = parent.children.indexOf(child);
    if (i > -1) {
      parent.children.splice(i, 1);
    } else {
      console.error("target: ", child);
      console.error("parent: ", parent);
      throw Error("target is not a childNode of parent");
    }
    child.parentNode = null;
  }
}

export const nodeOps = {
  createElement,
  insert,
};
