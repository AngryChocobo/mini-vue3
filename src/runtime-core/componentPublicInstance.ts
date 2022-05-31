import { ComponentInternalInstance } from "./component";

const publicPropertiesMap = {
  $el: (i: ComponentInternalInstance) => i.vnode.el,
} as const;

export const PublicInstanceProxyHandlers = {
  get({ _: instance }: { _: ComponentInternalInstance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    const publicHandler = publicPropertiesMap[key];
    if (publicHandler) {
      return publicHandler(instance);
    }
  },
};
