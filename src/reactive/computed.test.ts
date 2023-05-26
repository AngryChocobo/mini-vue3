import { describe, it, expect } from "vitest";
import { computed } from "./computed";
import { reactive } from "./reactive";

describe("computed", () => {
  it("should lazy", () => {
    const obj = reactive({ foo: 1, bar: 2 });
    let times = 0;
    const sumRes = computed(() => {
      times++;
      return obj.foo + obj.bar;
    });
    expect(times).toBe(0);
    sumRes.value;
    sumRes.value;
    expect(times).toBe(1);
    obj.foo = 2;
    expect(sumRes.value).toBe(4);
    expect(times).toBe(2);
  });
});
