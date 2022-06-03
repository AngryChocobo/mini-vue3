import { ComponentInternalInstance } from "./component";

export function initProps(instance: ComponentInternalInstance, rawProps) {
  instance.props = rawProps ?? {};
}
