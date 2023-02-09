import { RendererElement } from "./renderer";
import { createVNode } from "./vnode";

export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer: RendererElement) {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer, null);
      },
    };
  };
}
