import { effect, stop } from "../effect";
import { reactive, markRaw } from "../reactive";

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

  it("should observe multiple properties", () => {
    let dummy;
    const counter = reactive({ num1: 0, num2: 0 });
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2));

    expect(dummy).toBe(0);
    counter.num1 = counter.num2 = 7;
    expect(dummy).toBe(21);
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
  test("stop", () => {
    let dummy;

    const obj = reactive({ foo: 1 });
    const runner = effect(function foo() {
      dummy = obj.foo;
    });

    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });
  test("onStop", () => {
    const onStop = jest.fn();
    const obj = reactive({ foo: 1 });
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );
    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  test("markRaw", () => {
    const obj = reactive({
      foo: markRaw({
        prop: 0,
      }),
    });
    let dummy;
    effect(() => {
      dummy = obj.foo.prop;
    });
    expect(dummy).toBe(0);
    obj.foo.prop++;
    expect(dummy).toBe(0);
    obj.foo = { prop: 1 };
    expect(dummy).toBe(1);
  });
});
