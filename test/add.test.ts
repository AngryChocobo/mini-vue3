import { assert, expect, test } from "vitest";
import { add } from "../src/main";

test("add", () => {
  expect(add(1, 1)).toBe(2);
});
