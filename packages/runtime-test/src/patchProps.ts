import { TestElement } from "./nodeOps";

export function patchProps(
  el: TestElement,
  key: string,
  prevValue: any,
  nextValue: any
) {
  el.props[key] = nextValue;
}
