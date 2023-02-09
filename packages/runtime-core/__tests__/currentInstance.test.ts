import { h, getCurrentInstance } from "../src/index";

import { createAppInstance } from "./beforeEach";

let current: any;
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

describe.skip("props", () => {
  beforeEach(() => {
    createAppInstance(App);
  });
  test("props", () => {
    expect(current).not.toBeFalsy();
    expect(current.type.name).toBe("App");
  });
});
