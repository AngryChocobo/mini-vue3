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
    const effectFn = vi.fn(() => {
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

  it("nested effect", () => {
    // 原始数据
    const data = { foo: true, bar: true };
    // 代理对象
    const obj = reactive(data);

    // 全局变量
    let temp1, temp2;

    const effectFn2 = vi.fn(() => {
      temp2 = obj.bar;
    });
    const effectFn1 = vi.fn(() => {
      effect(effectFn2);
      temp1 = obj.foo;
    });

    // effectFn1 嵌套了 effectFn2
    effect(effectFn1);

    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    obj.foo = false;
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
  });

  it("avoid inifinite loop", () => {
    const obj = reactive({
      count: 0,
    });

    const effectFn = vi.fn(() => {
      obj.count++;
    });
    effect(effectFn);
    // fix RangeError: Maximum call stack size exceeded
    expect(effectFn).toBeCalledTimes(1);
  });
});
