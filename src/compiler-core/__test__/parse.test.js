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

  describe("Element", () => {
    test("simple div", () => {
      const ast = baseParse("<div></div>");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });
});
