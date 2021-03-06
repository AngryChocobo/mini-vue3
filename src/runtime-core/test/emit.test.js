import { h } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

let value = 0;

const App = {
  name: "App",
  render() {
    return h("div", { id: "title", class: "title" }, [
      h(Dog, {
        onWoof() {
          value++;
        },
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
        onClick: this.onClick,
      },
      this.dogName
    );
  },
  setup(props, { emit }) {
    return {
      dogName: "旺财",
      onClick() {
        emit("woof");
      },
    };
  },
};

describe("emit", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "log");

    createAppInstance(App);
  });
  test("emit", () => {
    const dog = document.querySelector(".dog");
    expect(value).toBe(0);
    dog.click();
    expect(value).toBe(1);
  });
});
