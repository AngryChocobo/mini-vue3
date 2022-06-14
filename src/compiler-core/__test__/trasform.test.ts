import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
  test("happy path", () => {
    const ast = baseParse("<p>Hello{{World}}</p>");
    expect(ast.children[0].children[0].content).toBe("Hello");
    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = "GoodBye";
      }
    };
    transform(ast, {
      nodeTransforms: [plugin],
    });
    expect(ast.children[0].children[0].content).toBe("GoodBye");
  });
});
