import { h } from "runtime-core/src";
import { createAppInstance } from "./beforeEach";

let component;
const App = {
  name: "App",
  render() {
    component = this;
    return h("div", { id: "title", class: "title" }, (this as any).msg);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};

describe("proxyData", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("proxyData", () => {
    const target = document.querySelector("#title") as HTMLDivElement;
    expect(target).toBeDefined();
    expect(target.getAttribute("id")).toBe("title");
    expect(target.className).toBe("title");
    expect(target.textContent).toBe("mini-vue");
  });
  test("$el", () => {
    const target = document.querySelector("#title");
    expect(component.$el).toEqual(target);
  });
});
