import { h, getCurrentInstance } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

let current = null;
const App = {
  name: "App",
  render() {
    return h("div", {}, "Hello");
  },
  setup() {
    current = getCurrentInstance();
    console.log(current);
    return {};
  },
};

describe("props", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("props", () => {
    expect(current).not.toBeFalsy();
    expect(current.type.name).toBe("App");
  });
});
