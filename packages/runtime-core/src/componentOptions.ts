import { VNodeTypes } from "./vnode";

export type ComponentOptions = VNodeTypes & {
  setup: (props: unknown, context: unknown) => unknown;
  render: () => unknown;
};
