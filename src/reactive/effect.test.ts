import { describe, expect, it, vi } from "vitest";
import { effect } from "./effect";
import { reactive } from "./reactive";

describe("effect", () => {
  it("reactive", () => {
    let dummy;
    const obj = reactive({ text: "hi" });
    effect(() => {
      dummy = obj.text;
    });
    expect(dummy).toBe("hi");
    obj.text = "bye";
    expect(dummy).toBe("bye");
  });

  it("branch change", () => {
    const data = { ok: true, text: "hello world" };
    const obj = reactive(data);

    let dummy;
    const effectFn = vi.fn(function effectFn() {
      dummy = obj.ok ? obj.text : "not";
    });
    effect(effectFn);
    expect(effectFn).toBeCalledTimes(1);
    expect(dummy).toBe("hello world");
    obj.ok = false;
    expect(effectFn).toBeCalledTimes(2);
    expect(dummy).toBe("not");
    obj.text = "should not trigger effect";
    expect(effectFn).toBeCalledTimes(2);
    expect(dummy).toBe("not");
  });
});
