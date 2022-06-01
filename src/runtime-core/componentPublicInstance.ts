import { hasOwn } from "../utils/index";
import { ComponentInternalInstance } from "./component";

const publicPropertiesMap = {
  $el: (i: ComponentInternalInstance) => i.vnode.el,
} as const;

export const PublicInstanceProxyHandlers = {
  get({ _: instance }: { _: ComponentInternalInstance }, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    }
    if (hasOwn(props, key)) {
      return props[key];
    }
    const publicHandler = publicPropertiesMap[key];
    if (publicHandler) {
      return publicHandler(instance);
    }
  },
};
