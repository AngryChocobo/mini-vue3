import { h, provide, inject } from "../index";
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
    return h("div", {}, [h("span", {}, (this as any).foo + "-"), h(Consumer)]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz");
    const defaultValue = inject("default", "defaultValue");
    const defaultValue2 = inject("default", () => "defaultValue2");
    return {
      foo,
      bar,
      baz,
      defaultValue,
      defaultValue2,
    };
  },
  render() {
    return h(
      "div",
      {},
      `${(this as any).foo}-${(this as any).bar}-${(this as any).baz}-${
        (this as any).defaultValue
      }-${(this as any).defaultValue2}`
    );
  },
};

describe.skip("createApp", () => {
  beforeEach(() => {
    createAppInstance(ProviderOne);
  });
  test("createApp", () => {
    expect(document.body.textContent).toBe(
      "provide:foo-fooOverride-bar-baz-defaultValue-defaultValue2"
    );
  });
});
