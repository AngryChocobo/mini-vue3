import { h, renderSlots, createTextVNode } from "../index";

import { createAppInstance } from "./beforeEach";

const Hello = {
  name: "Hello",
  render() {
    // console.log("this.$slots:", this.$slots);
    return h("p", {}, [renderSlots((this as any).$slots)]);
  },
  setup() {
    return {};
  },
};

const World = {
  name: "World",
  render() {
    // console.log("this.$slots:", this.$slots);
    return h("p", {}, [renderSlots((this as any).$slots)]);
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
      renderSlots((this as any).$slots, "first", "^"),
      renderSlots((this as any).$slots, "second"),
      renderSlots((this as any).$slots, "third"),
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

describe.skip("slot", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("slot", () => {
    const target = document.querySelector("#title") as HTMLDivElement;
    // expect(target.textContent).toBe("Hello, World~可达鸭");
    expect(target.textContent).toBe("可^达鸭嘎嘎嘎");
  });
});
