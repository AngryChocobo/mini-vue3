import { TestElement } from "./nodeOps";

export function patchProps(
  el: TestElement,
  key: string,
  prevValue: unknown,
  nextValue: unknown
) {
  el.props[key] = nextValue;
}
