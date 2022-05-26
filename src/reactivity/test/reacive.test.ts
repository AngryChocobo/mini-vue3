import { reactive } from "../reactive";

describe("reactive", () => {
  test("happy ", () => {
    const origin = {
      age: 10,
    };
    const user = reactive(origin);
    expect(user).not.toBe(origin);
  });
});
