import { ComponentInternalInstance } from "./component";

export function initProps(instance: ComponentInternalInstance) {
  instance.props = instance.vnode.props ?? {};
}
