import { h, provide, inject } from "../../../lib/mini-vue.esm.js";
import { createAppInstance } from "./beforeEach";

const ProviderOne = {
  name: "ProviderOne",
  setup() {
    provide("foo", "foo");
    provide("bar", "bar");
  },
  render() {
    return h("div", {}, [h("div", {}, "provide:"), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    // override parent value
    provide("foo", "fooOverride");
    provide("baz", "baz");
    const foo = inject("foo");

    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [h("span", {}, this.foo + "-"), h(Consumer)]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz");
    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h("div", {}, `${this.foo}-${this.bar}-${this.baz}`);
  },
};

describe("createApp", () => {
  beforeEach(() => {
    createAppInstance(ProviderOne);
  });
  test("createApp", () => {
    expect(document.body.textContent).toBe("provide:foo-fooOverride-bar-baz");
  });
});
