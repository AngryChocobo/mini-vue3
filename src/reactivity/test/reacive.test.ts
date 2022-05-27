import { reactive, readonly } from "../reactive";

describe("reactive", () => {
  test("happy ", () => {
    const origin = {
      age: 10,
    };
    const user = reactive(origin);
    expect(user).not.toBe(origin);
    expect(user.age).toBe(10);
  });
});

describe("readonly", () => {
  test("readonly ", () => {
    console.warn = jest.fn();
    const origin = {
      age: 10,
    };
    const user = readonly(origin);
    expect(user).not.toBe(origin);
    expect(user.age).toBe(10);

    user.age = 35;
    expect(user.age).toBe(10);
    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "set readonly target key: age failed",
      user
    );
  });
});
