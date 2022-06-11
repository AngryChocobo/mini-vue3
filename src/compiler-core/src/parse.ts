import { NodeTypes, TagTypes } from "./ast";

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
  } else if (context.source.startsWith("<")) {
    node = parseElement(context);
  } else {
    node = parseText(context);
  }
  nodes.push(node);
  return nodes;
}

function parseInterpolation(context: ParseContext) {
  const closeIndex = context.source.indexOf(closeDelimiter);
  advanceBy(context, openDelimiter.length);
  const rowContentLength = closeIndex - closeDelimiter.length;
  const rowContent = parseTextData(context, rowContentLength);
  const content = rowContent.trim();
  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function parseElement(context: ParseContext) {
  const element = parseTag(context, TagTypes.START);
  parseTag(context, TagTypes.END);
  console.log(context.source);
  return element;
}

function parseTag(context: ParseContext, tagType: TagTypes) {
  const match = /<\/?([a-z]*)/i.exec(context.source);
  if (match && match[1]) {
    const tagName = match[1];
    advanceBy(context, match[0].length + 1);
    // console.log(context.source);
    if (tagType === TagTypes.END) {
      return;
    }
    return {
      type: NodeTypes.ELEMENT,
      tag: tagName,
      children: [],
    };
  }
}

function parseText(context: ParseContext) {
  const content = parseTextData(context, context.source.length);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: ParseContext, length: number) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
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
