import { baseParse } from "../src/parse";
import { NodeTypes } from "../src/ast";
describe("parse", () => {
  describe("interpolation", () => {
    test("simple", () => {
      const ast = baseParse("{{message}}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: `message`,
        },
      });
    });
  });
});
