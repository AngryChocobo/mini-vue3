import { reactive } from "reactivity";
import { watchEffect } from "../src/index";
import { nextTick } from "../src/index";

describe("api: watch", () => {
  it("effect", async () => {
    const state = reactive({ count: 0 });
    let dummy;
    watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    state.count++;
    await nextTick();
    expect(dummy).toBe(1);
  });
});
