import type { RefObject } from "react";
import { useMemo } from "react";
import { PaneFooter, PaneHeader } from "./components";
import { getTextStats } from "./textStats";
import { MAX_EDITOR_CHARS } from "./constants";

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onScroll: () => void;
}

export function EditorPane({
  value,
  onChange,
  textareaRef,
  onScroll,
}: EditorPaneProps) {
  const stats = useMemo(() => getTextStats(value), [value]);

  return (
    <div className="flex flex-col flex-1 min-h-0 border-r border-gray-200 dark:border-gray-800">
      <PaneHeader label="Editor" />
      <textarea
        ref={textareaRef}
        className="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        spellCheck={false}
        placeholder="Type your markdown here..."
      />
      <PaneFooter stats={stats} maxChars={MAX_EDITOR_CHARS} />
    </div>
  );
}
