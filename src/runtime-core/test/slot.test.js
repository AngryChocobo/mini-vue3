import { h } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";
const World = {
  name: "World",
  render() {
    console.log("this.$slots:", this.$slots);
    return h("span", {}, [this.$slots]);
  },
  setup() {
    return {};
  },
};

const App = {
  name: "App",
  render() {
    const hello = h("div", {}, "Hello");
    const world = h(World, {}, h("p", {}, ", I am slot p"));
    return h("div", { id: "title", class: "title" }, [hello, world]);
  },
  setup() {
    return {};
  },
};

describe("slot", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "log");

    createAppInstance(App);
  });
  test("slot", () => {
    const target = document.querySelector("#title");
    expect(target.textContent).toBe("Hello, I am slot p");
  });
});
