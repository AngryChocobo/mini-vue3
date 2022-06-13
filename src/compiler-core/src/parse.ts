import { NodeTypes, TagTypes } from "./ast";

type ParseContext = ReturnType<typeof createParseContext>;
const openDelimiter = "{{";
const closeDelimiter = "}}";

export function baseParse(content: string) {
  const context = createParseContext(content);
  const root = createRoot(parseChildren(context, ""));
  return root;
}

function parseChildren(context: ParseContext, parentTag: string) {
  const nodes: any[] = [];
  while (!isEnd(context, parentTag)) {
    let node;
    if (context.source.startsWith(openDelimiter)) {
      node = parseInterpolation(context);
    } else if (context.source.startsWith("<")) {
      node = parseElement(context);
    } else if (context.source !== "") {
      node = parseText(context);
    }
    if (node) {
      nodes.push(node);
    }
  }
  return nodes;
}
function isEnd(context: ParseContext, parentTag: string) {
  return context.source === "" || context.source.startsWith(`</${parentTag}>`);
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
  if (element) {
    element.children = parseChildren(context, element.tag);
  }
  parseTag(context, TagTypes.END);

  console.log(context.source);
  return element;
}

function parseTag(context: ParseContext, tagType: TagTypes) {
  const match = /<\/?([a-z]*)/i.exec(context.source) as RegExpExecArray;
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
      children: [] as any[],
    };
  }
}

function parseText(context: ParseContext) {
  let endIndex = context.source.length;
  let endTokens = ["<", "{{"];

  for (let token of endTokens) {
    let index = context.source.indexOf(token);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);
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
