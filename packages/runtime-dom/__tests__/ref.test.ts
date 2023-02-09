import { h, createTextVNode } from "runtime-core";
import { ref } from "reactivity";
import { createAppInstance } from "./beforeEach";

const App = {
  render() {
    return h("div", { id: "title" }, [createTextVNode((this as any).count)]);
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
