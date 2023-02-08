import { h, provide, inject } from "../index";
import { createAppInstance } from "./beforeEach";

const App = {
  name: "App",
  render() {
    return h("div", { id: "title", class: "title" }, "mini-vue3");
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};

describe.skip("createApp", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("createApp", () => {
    const target = document.querySelector("#title") as HTMLElement;
    expect(target).toBeDefined();
    expect(target).toBeTruthy;
    expect(target.getAttribute("id")).toBe("title");
    expect(target.className).toBe("title");
    expect(target.textContent).toBe("mini-vue3");
  });
});
