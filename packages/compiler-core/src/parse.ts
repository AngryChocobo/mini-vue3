import { NodeTypes, TagTypes } from "./ast";

type ParseContext = ReturnType<typeof createParseContext>;
const openDelimiter = "{{";
const closeDelimiter = "}}";

export function baseParse(content: string) {
  const context = createParseContext(content);
  const root = createRoot(parseChildren(context, [] as string[]));
  return root;
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}

function createRoot<T>(children: T[]) {
  return {
    children,
  };
}

export type BaseNode = {
  type: NodeTypes;
};

interface TextNode extends BaseNode {
  type: NodeTypes.TEXT;
  content: string;
}

export interface ElementNode extends BaseNode {
  type: NodeTypes.ELEMENT;
  tag: string;
  children: any[];
}

interface InterpolationNode extends BaseNode {
  type: NodeTypes.INTERPOLATION;
  content: {
    type: NodeTypes.SIMPLE_EXPRESSION;
    content: string;
  };
}
export type ChildrenNode =
  | ElementNode
  | InterpolationNode
  | TextNode
  | undefined;

function parseChildren(context: ParseContext, ancestor: string[]) {
  const nodes: ChildrenNode[] = [];
  while (!isEnd(context, ancestor)) {
    let node: ChildrenNode;
    if (context.source.startsWith(openDelimiter)) {
      node = parseInterpolation(context);
    } else if (context.source.startsWith("<")) {
      node = parseElement(context, ancestor);
    } else if (context.source !== "") {
      node = parseText(context);
    }
    if (node) {
      nodes.push(node);
    }
  }
  return nodes;
}
function isEnd(context: ParseContext, ancestor: string[]) {
  const s = context.source;
  if (s.startsWith("</")) {
    for (let index = 0; index < ancestor.length; index++) {
      const tag = ancestor[index];
      if (s.slice(2, 2 + tag.length) === tag) {
        return true;
      }
    }
  }
  return !context.source;
}

function parseInterpolation(context: ParseContext): InterpolationNode {
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

function parseElement(context: ParseContext, ancestor: string[]) {
  const element = parseTag(context, TagTypes.START);
  if (element) {
    ancestor.push(element.tag);
    element.children = parseChildren(context, ancestor);
    ancestor.pop();
    if (context.source.slice(2, 2 + element.tag.length) === element.tag) {
      parseTag(context, TagTypes.END);
    } else {
      throw new Error(`miss a close tag: ${element.tag}`);
    }
  }
  return element;
}

function parseTag(
  context: ParseContext,
  tagType: TagTypes
): ElementNode | undefined {
  const match = /<\/?([a-z]*)/i.exec(context.source) as RegExpExecArray;
  if (match && match[1]) {
    const tagName = match[1];
    advanceBy(context, match[0].length + 1);
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

function parseText(context: ParseContext): TextNode {
  let endIndex = context.source.length;
  const endTokens = ["<", "{{"];

  for (const token of endTokens) {
    const index = context.source.indexOf(token);
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
