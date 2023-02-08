import { h, provide, inject } from "../index";

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

describe.skip("props", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("props", () => {
    const dog = document.querySelector(".dog") as HTMLDivElement;
    expect(dog.textContent).toBe("旺财");
  });
});
