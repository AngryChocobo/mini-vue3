import { h } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const App = {
  name: "App",
  render() {
    return h("div", { id: "title", class: "title" }, [
      h(Dog, {
        onWoof() {
          console.log("dog woof");
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
  test("", () => {
    const dog = document.querySelector(".dog");
    dog.click();
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith("dog woof");
  });
});
