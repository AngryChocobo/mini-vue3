import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  test("happy ", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age++;

    expect(nextAge).toBe(12);
  });

  test("should return runner when call effect", () => {
    let age = 10;
    const runner = effect(() => {
      age++;
      return "foo";
    });
    expect(age).toBe(11);
    const r = runner();
    expect(age).toBe(12);
    expect(r).toBe("foo");
  });
  test("scheduler", () => {
    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
});
