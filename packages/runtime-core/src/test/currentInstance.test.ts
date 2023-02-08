import {
  h,
  getCurrentInstance,
  ComponentInternalInstance,
} from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

let current = ComponentInternalInstance;
const App = {
  name: "App",
  render() {
    return h("div", {}, "Hello");
  },
  setup() {
    current = getCurrentInstance();
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
