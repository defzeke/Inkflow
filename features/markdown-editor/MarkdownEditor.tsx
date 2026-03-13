"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Toolbar } from "./Toolbar";
import { EditorPane } from "./EditorPane";
import { PreviewPane } from "./PreviewPane";
import { PublishModal } from "./components";
import { INITIAL_MARKDOWN, type PreviewRenderer } from "./constants";

function clearSyncSource(
  syncSourceRef: MutableRefObject<"editor" | "preview" | null>,
  resetSyncFrameRef: MutableRefObject<number | null>
) {
  if (resetSyncFrameRef.current !== null) {
    window.cancelAnimationFrame(resetSyncFrameRef.current);
  }

  resetSyncFrameRef.current = window.requestAnimationFrame(() => {
    syncSourceRef.current = null;
    resetSyncFrameRef.current = null;
  });
}

function syncScrollPosition(
  source: HTMLTextAreaElement | HTMLDivElement | null,
  target: HTMLTextAreaElement | HTMLDivElement | null,
  sourceName: "editor" | "preview",
  syncSourceRef: MutableRefObject<"editor" | "preview" | null>,
  resetSyncFrameRef: MutableRefObject<number | null>
) {
  if (!source || !target) {
    return;
  }

  const sourceRange = source.scrollHeight - source.clientHeight;
  const targetRange = target.scrollHeight - target.clientHeight;
  const scrollRatio = sourceRange > 0 ? source.scrollTop / sourceRange : 0;

  syncSourceRef.current = sourceName;
  target.scrollTop = scrollRatio * Math.max(targetRange, 0);
  clearSyncSource(syncSourceRef, resetSyncFrameRef);
}

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
  const [isDark, setIsDark] = useState(false);
  const [renderer, setRenderer] = useState<PreviewRenderer>("markdown");
  const [syncScroll, setSyncScroll] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const syncScrollRef = useRef(syncScroll);
  syncScrollRef.current = syncScroll;
  const syncSourceRef = useRef<"editor" | "preview" | null>(null);
  const lastScrolledPaneRef = useRef<"editor" | "preview">("editor");
  const resetSyncFrameRef = useRef<number | null>(null);

  function handleEditorScroll() {
    lastScrolledPaneRef.current = "editor";

    if (!syncScrollRef.current || syncSourceRef.current === "preview") {
      return;
    }

    syncScrollPosition(
      editorRef.current,
      previewRef.current,
      "editor",
      syncSourceRef,
      resetSyncFrameRef
    );
  }

  function handlePreviewScroll() {
    lastScrolledPaneRef.current = "preview";

    if (!syncScrollRef.current || syncSourceRef.current === "editor") {
      return;
    }

    syncScrollPosition(
      previewRef.current,
      editorRef.current,
      "preview",
      syncSourceRef,
      resetSyncFrameRef
    );
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setIsDark(mediaQuery.matches);

    function handleThemeChange(event: MediaQueryListEvent) {
      setIsDark(event.matches);
    }

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (!syncScroll) {
      syncSourceRef.current = null;
    }
  }, [syncScroll]);

  useEffect(() => {
    if (!syncScroll) return;

    const frame = window.requestAnimationFrame(() => {
      if (lastScrolledPaneRef.current === "preview") {
        syncScrollPosition(
          previewRef.current,
          editorRef.current,
          "preview",
          syncSourceRef,
          resetSyncFrameRef
        );
        return;
      }

      syncScrollPosition(
        editorRef.current,
        previewRef.current,
        "editor",
        syncSourceRef,
        resetSyncFrameRef
      );
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [markdown, renderer, syncScroll]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Toolbar
        isDark={isDark}
        onToggleDark={() => setIsDark((darkMode) => !darkMode)}
        renderer={renderer}
        onRendererChange={setRenderer}
        syncScroll={syncScroll}
        onToggleSyncScroll={() => setSyncScroll((enabled) => !enabled)}
        onPublish={() => setIsPublishOpen(true)}
      />
      {/* Mobile tab bar */}
      <div className="sm:hidden flex shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
            mobileTab === "editor"
              ? "border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
            mobileTab === "preview"
              ? "border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          Preview
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${mobileTab === "editor" ? "flex" : "hidden"} sm:flex flex-col flex-1 sm:flex-none sm:w-1/2 min-w-0 overflow-hidden`}
        >
          <EditorPane
            value={markdown}
            onChange={setMarkdown}
            textareaRef={editorRef}
            onScroll={handleEditorScroll}
          />
        </div>
        <div
          className={`${mobileTab === "preview" ? "flex" : "hidden"} sm:flex flex-col flex-1 sm:flex-none sm:w-1/2 min-w-0 overflow-hidden`}
        >
          <PreviewPane
            markdown={markdown}
            renderer={renderer}
            previewRef={previewRef}
            onScroll={handlePreviewScroll}
          />
        </div>
      </div>
      {isPublishOpen && (
        <PublishModal
          markdown={markdown}
          onClose={() => setIsPublishOpen(false)}
        />
      )}
    </div>
  );
}
