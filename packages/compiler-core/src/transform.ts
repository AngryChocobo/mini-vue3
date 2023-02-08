type TransformOption = {
  nodeTransforms: Function[];
};

type TransformContext = ReturnType<typeof createTransformContext>;

export function transform(root, options: TransformOption) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
}

function traverseNode(node, context: TransformContext) {
  // console.log(node);
  context.nodeTransforms.forEach((transer) => transer(node));
  traverseChildren(node, context);
}

function traverseChildren(node: any, context: TransformContext) {
  const { children } = node;
  if (children) {
    for (const item of children) {
      traverseNode(item, context);
    }
  }
}

function createTransformContext(root: any, options: TransformOption) {
  return {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };
}
