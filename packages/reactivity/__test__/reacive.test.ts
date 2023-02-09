import {
  reactive,
  readonly,
  shallowReadonly,
  isReactive,
  isReadonly,
  isProxy,
} from "../src/reactive";

describe("reactive", () => {
  test("happy ", () => {
    const origin = {
      age: 10,
    };
    const user = reactive(origin);
    expect(user).not.toBe(origin);
    expect(user.age).toBe(10);
  });
  test("isReactive", () => {
    const origin = {
      age: 10,
    };
    const user = reactive({
      age: 10,
    });
    expect(isReactive(origin)).toBe(false);
    expect(isReactive(user)).toBe(true);
    expect(isProxy(user)).toBe(true);
  });
  test("nested reactive", () => {
    const original = {
      nested: {
        foo: null,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});

describe("readonly", () => {
  test("readonly", () => {
    console.warn = jest.fn();
    const origin = {
      age: 10,
    };
    const user = readonly(origin);
    expect(user).not.toBe(origin);
    expect(user.age).toBe(10);
    expect(isReadonly(origin)).toBe(false);
    expect(isReadonly(user)).toBe(true);
    expect(isProxy(user)).toBe(true);

    user.age = 35;
    expect(user.age).toBe(10);
    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "set readonly target key: age failed",
      user
    );
  });
  test("nested readonly", () => {
    const original = {
      nested: {
        foo: null,
      },
      array: [{ bar: 2 }],
    };
    const observed = readonly(original);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(observed.nested)).toBe(true);
    expect(isReadonly(observed.array)).toBe(true);
    expect(isReadonly(observed.array[0])).toBe(true);
  });

  test("shallowReadonly", () => {
    const original = {
      nested: {
        foo: null,
      },
      array: [{ bar: 2 }],
    };
    const observed = shallowReadonly(original);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(observed.nested)).toBe(false);
    expect(isReadonly(observed.nested.foo)).toBe(false);
    expect(isReadonly(observed.array)).toBe(false);
    expect(isReadonly(observed.array[0])).toBe(false);
  });
});
