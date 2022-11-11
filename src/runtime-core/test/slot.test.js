import { h, renderSlots, createTextVNode } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const Hello = {
  name: "Hello",
  render() {
    // console.log("this.$slots:", this.$slots);
    return h("p", {}, [renderSlots(this.$slots)]);
  },
  setup() {
    return {};
  },
};

const World = {
  name: "World",
  render() {
    // console.log("this.$slots:", this.$slots);
    return h("p", {}, [renderSlots(this.$slots)]);
  },
  setup() {
    return {};
  },
};

const Duck = {
  name: "Duck",
  render() {
    // console.log("this.$slots:", this.$slots);
    return h("p", {}, [
      renderSlots(this.$slots, "first", "^"),
      renderSlots(this.$slots, "second"),
      renderSlots(this.$slots, "third"),
    ]);
  },
  setup() {
    return {};
  },
};
const App = {
  name: "App",
  render() {
    const hello = h(Hello, {}, h("span", {}, "Hello, "));
    const world = h(World, {}, [h("span", {}, "World~")]);
    const duck = h(
      Duck,
      {},
      {
        third: () => [h("span", {}, "鸭"), createTextVNode("嘎嘎嘎")],
        first: (props) => h("span", {}, "可" + props),
        second: () => h("span", {}, "达"),
      }
    );
    // return h("div", { id: "title", class: "title" }, [hello, world, duck]);
    // return h("div", { id: "title", class: "title" }, [hello]);
    return h("div", { id: "title", class: "title" }, [duck]);
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
    // expect(target.textContent).toBe("Hello, World~可达鸭");
    expect(target.textContent).toBe("可^达鸭嘎嘎嘎");
  });
});
