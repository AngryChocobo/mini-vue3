import { h } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const App = {
  name: "App",
  render() {
    return h("div", { id: "title", class: "title" }, [
      h(Dog, {
        dogName: "旺财",
      }),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};

const Dog = {
  name: "Dog",
  render() {
    return h(
      "button",
      {
        class: "dog",
      },
      this.dogName
    );
  },
  setup() {
    return {};
  },
};

describe("emit", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("", () => {
    const dog = document.querySelector(".dog");
    expect(dog.textContent).toBe("旺财");
  });
});
