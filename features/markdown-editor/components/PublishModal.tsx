"use client";

import { useMemo, useState } from "react";
import { PREVIEW_RENDERERS, type PreviewRenderer } from "../constants";
import { buildShareUrl } from "@/libs/share";
import type { ShareFormat } from "@/libs/share";

interface PublishModalProps {
  markdown: string;
  onClose: () => void;
}

export function PublishModal({ markdown, onClose }: PublishModalProps) {
  const [format, setFormat] = useState<PreviewRenderer>("markdown");
  const [publisher, setPublisher] = useState("");
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(
    () =>
      buildShareUrl(
        window.location.origin,
        markdown,
        format as ShareFormat,
        publisher || undefined
      ),
    [markdown, format, publisher]
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md mx-4 sm:mx-0 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Publish
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Format
          </p>
          <div
            className="flex rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1"
            role="group"
            aria-label="Share format"
          >
            {PREVIEW_RENDERERS.map((option) => {
              const isActive = option.value === format;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormat(option.value)}
                  className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Publisher
          </p>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="e.g. Zeke"
            className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Shareable Link
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 min-w-0 text-xs px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none truncate transition-colors"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="sm:shrink-0 px-3 py-2 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
