import { h, ref, createTextVNode } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const App = {
  render() {
    return h("div", { id: "title" }, [
      createTextVNode(this.count),
      h("button", { onClick: this.onClick }, "自增"),
    ]);
  },
  setup() {
    let count = ref(1);
    function onClick() {
      count++;
    }
    return {
      count,
      onClick,
    };
  },
};

describe("ref", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("should display ref.value in render function ", () => {
    const target = document.querySelector("#title");
    expect(target).toBeDefined();
    expect(target.textContent).toBe("1自增");
  });
});
