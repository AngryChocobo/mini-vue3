import { h, renderSlots } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const Hello = {
  name: "Hello",
  render() {
    console.log("this.$slots:", this.$slots);
    return h("p", {}, [renderSlots(this.$slots)]);
  },
  setup() {
    return {};
  },
};

const World = {
  name: "World",
  render() {
    console.log("this.$slots:", this.$slots);
    return h("p", {}, [renderSlots(this.$slots)]);
  },
  setup() {
    return {};
  },
};

const App = {
  name: "App",
  render() {
    const hello = h(Hello, {}, h("span", {}, "Hello, "));
    const world = h(World, {}, [h("span", {}, "I am slot")]);
    return h("div", { id: "title", class: "title" }, [hello, world]);
  },
  setup() {
    return {};
  },
};

describe("slot", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("slot", () => {
    const target = document.querySelector("#title");
    expect(target.textContent).toBe("Hello, I am slot");
  });
});
