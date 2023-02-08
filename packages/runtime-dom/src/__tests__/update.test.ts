import { ref } from "reactivity";
import { h, createTextVNode } from "runtime-core";
import { createAppInstance } from "./beforeEach";

const App = {
  name: "App",
  render() {
    return h("div", { id: "root" }, [
      h("div", { id: "count" }, [createTextVNode((this as any).count)]),
      h("button", { onClick: (this as any).onClick }, "自增"),
    ]);
  },
  setup() {
    const count = ref(1);
    function onClick() {
      count.value++;
    }
    const props = ref({
      foo: "foo",
      bar: "bar",
    });
    return {
      count,
      onClick,
      props,
    };
  },
};

describe("update element", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test.only("should update", () => {
    const text = document.querySelector("#count") as HTMLDivElement;
    expect(text.textContent).toBe("1");
  });

  test.only("should update", () => {
    const obj1 = {
      foo: "123",
      bar: "456",
    };
    const obj2 = {
      bar: "456",
      foo: "123",
    };
    expect(obj1).not.toBe(obj2);

    expect(obj1).toEqual(obj2);
    expect(obj1).toStrictEqual(obj2);

    const arr1 = [1, 3];
    const arr2 = [1, 3];
    expect(arr1).not.toBe(arr2);
    expect(arr1).toEqual(arr2);
    expect(arr1).toStrictEqual(arr2);
  });
});
