import type { RefObject } from "react";
import { useMemo } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PaneFooter, PaneHeader } from "./components";
import type { PreviewRenderer } from "./constants";
import { getTextStats, stripHtmlTags } from "./textStats";

interface PreviewPaneProps {
  markdown: string;
  renderer: PreviewRenderer;
  previewRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

export function PreviewPane({
  markdown,
  renderer,
  previewRef,
  onScroll,
}: PreviewPaneProps) {
  const { sanitizedHtml, htmlError } = useMemo(() => {
    if (renderer !== "html") return { sanitizedHtml: "", htmlError: null };
    try {
      return { sanitizedHtml: DOMPurify.sanitize(markdown), htmlError: null };
    } catch {
      return { sanitizedHtml: "", htmlError: "Unable to render HTML preview." };
    }
  }, [markdown, renderer]);

  const stats = useMemo(() => {
    const input =
      renderer === "html" && !htmlError ? stripHtmlTags(sanitizedHtml) : markdown;
    return getTextStats(input);
  }, [markdown, renderer, sanitizedHtml, htmlError]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PaneHeader label={renderer === "markdown" ? "Markdown Preview" : "HTML Preview"} />
      <div
        ref={previewRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto p-6 prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-gray-950"
      >
        {renderer === "markdown" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        ) : htmlError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{htmlError}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        )}
      </div>
      <PaneFooter stats={stats} />
    </div>
  );
}
