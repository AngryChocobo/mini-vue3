import { h, renderSlots, createTextVNode } from "runtime-core/src";
import { createAppInstance } from "./beforeEach";

const Duck = {
  name: "Duck",
  render() {
    console.log("this.$slots:", (this as any).$slots);
    const res = h("p", {}, [
      renderSlots((this as any).$slots, "first", "^"),
      renderSlots((this as any).$slots, "second"),
      renderSlots((this as any).$slots, "third"),
    ]);
    return res;
  },
  setup() {
    return {};
  },
};

const App = {
  name: "App",
  render() {
    const duck = h(
      Duck,
      {},
      {
        third: () => [h("span", {}, "鸭"), createTextVNode("嘎嘎嘎")],
        first: (props) => h("span", {}, "可" + props),
        second: () => h("span", {}, "达"),
      }
    );
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
  // TODO this case have error
  test.skip("slot", () => {
    const target = document.querySelector("#title") as HTMLDivElement;
    expect(target.textContent).toBe("可^达鸭嘎嘎嘎");
  });
});
