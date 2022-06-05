import { h, ref, createTextVNode } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const App = {
  render() {
    return h("div", { id: "title" }, [createTextVNode(this.count)]);
  },
  setup() {
    let count = ref(1);
    return {
      count,
    };
  },
};

describe("ref", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("should display ref.value in render function ", () => {
    expect(document.body.textContent).toBe("1");
  });
});
