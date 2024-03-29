import { effect } from "../src/effect";
import { ref, isRef, unRef, proxyRefs } from "../src/ref";

describe("ref", () => {
  test("should happy", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });
  test("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });
  test("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    a.value = {
      count: [],
    };
    expect(dummy).toStrictEqual([]);
  });

  test("isRef", () => {
    const origin = { count: 1 };
    const a = ref(origin);
    expect(isRef(origin)).toBe(false);
    expect(isRef(a)).toBe(true);
  });
  test("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });
  test("proxyRef", () => {
    const user = {
      age: ref(10),
      name: "goudan",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("goudan");

    proxyUser.age = 20;
    expect(user.age.value).toBe(20);
    expect(proxyUser.age).toBe(20);

    proxyUser.age = ref(10);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
  });
});
