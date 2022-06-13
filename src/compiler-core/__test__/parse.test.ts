import { baseParse } from "../src/parse";
import { NodeTypes } from "../src/ast";
describe("parse", () => {
  describe("Interpolation", () => {
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
    test("should trim", () => {
      const ast = baseParse("{{ message }}");
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
    test("elemet with text and interpolation", () => {
      const ast = baseParse("<p>Hello {{World}}");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "p",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "Hello ",
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "World",
            },
          },
        ],
      });
    });
    test("nest elemet with text and interpolation", () => {
      const ast = baseParse("<p><span>Hello</span>{{World}}</p>");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "p",
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: "span",
            children: [
              {
                type: NodeTypes.TEXT,
                content: "Hello",
              },
            ],
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "World",
            },
          },
        ],
      });
    });
  });

  describe("Text", () => {
    test("simple text", () => {
      const ast = baseParse("Hello World!");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "Hello World!",
      });
    });
  });
});
