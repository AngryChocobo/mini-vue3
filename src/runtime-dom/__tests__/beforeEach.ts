import { createApp, h } from "../../../lib/mini-vue.esm.js";

export const createAppInstance = (App: any) => {
  const rootContainer = document.createElement("div");
  rootContainer.setAttribute("id", "app");
  document.body.appendChild(rootContainer);
  createApp(App).mount(rootContainer);
};
