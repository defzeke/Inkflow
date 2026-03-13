"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExpiryCountdown } from "./components";
import { APP_NAME } from "./constants";
import type { PreviewRenderer } from "./constants";

interface SharePreviewProps {
  content: string;
  format: PreviewRenderer;
  publisher?: string;
  isExpired: boolean;
  expiresAt: number | null;
}

export function SharePreview({
  content,
  format,
  publisher,
  isExpired,
  expiresAt,
}: SharePreviewProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    if (format !== "html") return;
    setSanitizedHtml(DOMPurify.sanitize(content));
  }, [format, content]);

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-2xl">🔒</p>
        <h1 className="text-base font-semibold text-gray-700">Link Expired</h1>
        <p className="text-sm text-gray-400">
          This shared link was only valid for 30 days.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold shrink-0">{APP_NAME}</span>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {expiresAt && <ExpiryCountdown expiresAt={expiresAt} />}
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            {format === "html" ? "HTML" : "Markdown"}
          </span>
        </div>
      </header>
      <main className="py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-sm px-6 sm:px-14 py-10 sm:py-16">
          {publisher && (
            <p className="text-xs text-gray-400 mb-8 pb-6 border-b border-gray-100">
              Published by{" "}
              <span className="font-medium text-gray-600">{publisher}</span>
            </p>
          )}
          <div className="prose prose-sm max-w-none">
            {format === "markdown" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
