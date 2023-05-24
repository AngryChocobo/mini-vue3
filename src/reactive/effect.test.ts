import { describe, expect, it } from "vitest";
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
});
