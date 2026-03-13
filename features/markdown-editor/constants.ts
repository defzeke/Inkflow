export const APP_NAME = "Inkflow Studio";

export const MAX_EDITOR_CHARS = 10_000;

export const INITIAL_MARKDOWN = `# Welcome to Inkflow Studio

Start typing on the left to see a live preview here.

## Features

- **Bold**, *italic*, and \`inline code\`
- [Hyperlinks](https://heyzeke.me)
- ~~Strikethrough~~

## Code Block

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Syntax    | Description |
|-----------|-------------|
| Header    | Title       |
| Paragraph | Text        |

> Blockquotes are supported too.
`;

export const PREVIEW_RENDERERS = [
  { value: "markdown", label: "Markdown" },
  { value: "html", label: "HTML" },
] as const;

export type PreviewRenderer = (typeof PREVIEW_RENDERERS)[number]["value"];
