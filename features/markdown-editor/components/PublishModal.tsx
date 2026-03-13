"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [shortenUrl, setShortenUrl] = useState(false);
  const [shortId, setShortId] = useState<string | null>(null);
  const [isShortening, setIsShortening] = useState(false);
  const [shortenError, setShortenError] = useState(false);

  const longUrl = useMemo(
    () =>
      buildShareUrl(
        window.location.origin,
        markdown,
        format as ShareFormat,
        publisher || undefined
      ),
    [markdown, format, publisher]
  );

  const shareUrl =
    shortenUrl && shortId
      ? `${window.location.origin}/share/${shortId}`
      : longUrl;

  useEffect(() => {
    if (!shortenUrl) {
      setShortId(null);
      setShortenError(false);
      return;
    }

    let cancelled = false;
    setIsShortening(true);
    setShortId(null);
    setShortenError(false);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: markdown,
            format,
            publisher: publisher.trim() || undefined,
          }),
        });
        if (!res.ok) throw new Error();
        const { id } = await res.json();
        if (!cancelled) setShortId(id);
      } catch {
        if (!cancelled) setShortenError(true);
      } finally {
        if (!cancelled) setIsShortening(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [shortenUrl, markdown, format, publisher]);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayValue = isShortening
    ? "Generating short link…"
    : shortenError
    ? "Failed to shorten — using full link"
    : shareUrl;

  const isItalic = isShortening || shortenError;

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
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Shareable Link
            </p>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shortenUrl}
                onChange={(e) => setShortenUrl(e.target.checked)}
                className="w-3.5 h-3.5 accent-gray-700 dark:accent-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Shorten URL
              </span>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              readOnly
              value={displayValue}
              className={`flex-1 min-w-0 text-xs px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none truncate transition-colors ${
                isItalic
                  ? "text-gray-400 dark:text-gray-500 italic"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={isShortening}
              className="sm:shrink-0 px-3 py-2 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
