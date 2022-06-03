import { createApp, h } from "../../../lib/mini-vue.esm.js";

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

describe("createApp", () => {
  beforeEach(() => {
    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", "app");
    document.body.appendChild(rootContainer);

    createApp(App).mount(rootContainer);
  });
  test("createApp", () => {
    const target = document.querySelector("#title");
    expect(target).toBeDefined();
    expect(target.getAttribute("id")).toBe("title");
    expect(target.className).toBe("title");
    expect(target.textContent).toBe("mini-vue3");
  });
});
