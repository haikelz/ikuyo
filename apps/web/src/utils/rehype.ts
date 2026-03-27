import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { cn } from "../../../../packages/ui/src/lib/utils.ts";

const codeBlockCopyClass = cn(
  "inline-flex size-8 shrink-0 items-center justify-center rounded-4xl border border-border bg-secondary text-secondary-foreground shadow-xs transition-all hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "code-block-copy absolute bottom-3 right-3"
);

/**
 * Parse meta string to extract filename from title="..." or title=...
 * @param {string} meta - The meta string from code block (e.g. 'title="next.config.js"')
 * @returns {string|null} - The filename or null
 */
function parseFilenameFromMeta(meta: string | null): string | null {
  if (!meta || typeof meta !== "string") return null;
  const titleMatch = meta.match(/title\s*=\s*["']?([^"'\s]+)["']?/);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Extract language from className (e.g. "language-js" -> "js")
 * @param {string[]|string} classNames - Array of class names or space-separated string
 * @returns {string|null} - The language or null
 */
function getLanguageFromClass(classNames: string[] | string): string | null {
  const classes = Array.isArray(classNames)
    ? classNames
    : typeof classNames === "string"
    ? classNames.split(/\s+/)
    : [];
  const langClass = classes.find(
    (c) =>
      typeof c === "string" &&
      (c.startsWith("language-") || c.includes("language-"))
  );
  if (langClass) {
    const match = langClass.match(/language-([a-z0-9+-]+)/i);
    return match ? match[1] : langClass.replace("language-", "");
  }
  return null;
}

/**
 * Recursively find language-* class in a hast node
 */
function findLanguageInNode(node: any): string | null {
  if (!node) return null;
  if (node.type === "element" && node.properties) {
    const lang = getLanguageFromClass(node.properties.className);
    if (lang) return lang;
  }
  if (node.children) {
    for (const child of node.children) {
      const lang = findLanguageInNode(child);
      if (lang) return lang;
    }
  }
  return null;
}

/**
 * Rehype plugin to wrap code blocks with filename header and copy button
 */
export function rehypeCodeBlockWrapper() {
  return (tree: any) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre") return;

      const codeNode = node.children?.find(
        (child: any) => child.type === "element" && child.tagName === "code"
      );
      if (!codeNode) return;

      const codeProps = codeNode.properties || {};
      const preProps = node.properties || {};
      const codeClassNames = codeProps.className ?? [];
      const preClassNames = preProps.className ?? [];
      const meta =
        codeProps.meta ?? codeProps.dataMeta ?? codeProps["data-meta"] ?? null;
      const dataFilename =
        preProps["data-filename"] ??
        preProps.dataFilename ??
        codeProps["data-filename"] ??
        codeProps.dataFilename ??
        null;
      const language =
        preProps["data-language"] ??
        preProps.dataLanguage ??
        codeProps.language ??
        codeProps.dataLanguage ??
        codeProps["data-language"] ??
        getLanguageFromClass(preClassNames) ??
        getLanguageFromClass(codeClassNames) ??
        findLanguageInNode(node);

      const filename = dataFilename ?? parseFilenameFromMeta(meta);
      const label = filename ?? language ?? null;

      const wrapper = h(
        "div",
        {
          className: [
            "code-block-wrapper",
            "relative",
            "my-6",
            "overflow-hidden",
            "rounded-lg",
            "border",
            "border-neutral-800",
          ],
        },
        [
          ...(label
            ? [
                h(
                  "div",
                  {
                    className: [
                      "code-block-filename",
                      "px-4",
                      "py-2",
                      "text-sm",
                      "font-medium",
                      "bg-neutral-800/90",
                      "text-neutral-300",
                      "border-b",
                      "border-neutral-700/80",
                      "rounded-t-lg",
                    ],
                  },
                  label
                ),
              ]
            : []),
          h("div", { className: ["code-block-content", "relative", "group"] }, [
            node,
            h(
              "button",
              {
                type: "button",
                className: codeBlockCopyClass.split(/\s+/).filter(Boolean),
                "aria-label": "Copy code",
                "data-copy-button": "true",
              },
              [
                h(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                  },
                  [
                    h("rect", {
                      x: "9",
                      y: "9",
                      width: "13",
                      height: "13",
                      rx: "2",
                      ry: "2",
                    }),
                    h("path", {
                      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                    }),
                  ]
                ),
              ]
            ),
          ]),
        ].filter(Boolean)
      );

      parent.children[index!] = wrapper;
    });
  };
}
