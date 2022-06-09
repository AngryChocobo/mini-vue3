import { NodeTypes } from "./ast";

type ParseContext = ReturnType<typeof createParseContext>;
const openDelimiter = "{{";
const closeDelimiter = "}}";

export function baseParse(content: string) {
  const context = createParseContext(content);
  const root = createRoot(parseChildren(context));
  return root;
}

function parseChildren(context: ParseContext) {
  const nodes: any[] = [];
  let node;
  if (context.source.startsWith(openDelimiter)) {
    node = parseInterpolation(context);
  }
  nodes.push(node);
  return nodes;
}

function parseInterpolation(context: ParseContext) {
  const closeIndex = context.source.indexOf(closeDelimiter);
  advanceBy(context, openDelimiter.length);
  const rowContentLength = closeIndex - closeDelimiter.length;
  const content = context.source.slice(0, rowContentLength);
  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context: ParseContext, length: number) {
  context.source = context.source.slice(length);
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}

function createRoot(children) {
  return {
    children,
  };
}
