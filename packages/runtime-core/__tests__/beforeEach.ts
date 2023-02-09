import { createElement, nodeOps, patchProps } from "runtime-test";
import { createRenderer } from "../src";

const { createApp } = createRenderer({ ...nodeOps, patchProps });

export const createAppInstance = (App: any) => {
  const rootContainer = createElement("div");
  createApp(App).mount(rootContainer);
};
