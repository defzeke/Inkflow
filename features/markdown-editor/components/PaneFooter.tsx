import type { TextStats } from "../textStats";

type UsageTier = "normal" | "warning" | "danger" | "over";

function getUsageTier(ratio: number): UsageTier {
  if (ratio >= 1) return "over";
  if (ratio >= 0.9) return "danger";
  if (ratio >= 0.8) return "warning";
  return "normal";
}

const TEXT_COLOR: Record<UsageTier, string> = {
  normal:  "text-gray-900 dark:text-gray-100",
  warning: "text-amber-500 dark:text-amber-400",
  danger:  "text-orange-500 dark:text-orange-400",
  over:    "text-red-600 dark:text-red-400",
};

const BAR_COLOR: Record<UsageTier, string> = {
  normal:  "bg-gray-400 dark:bg-gray-500",
  warning: "bg-amber-400",
  danger:  "bg-orange-500",
  over:    "bg-red-500",
};

interface PaneFooterProps {
  stats: TextStats;
  maxChars?: number;
}

export function PaneFooter({ stats, maxChars }: PaneFooterProps) {
  const ratio = maxChars ? stats.characters / maxChars : 0;
  const tier = maxChars ? getUsageTier(ratio) : "normal";

  return (
    <footer className="grid grid-cols-3 gap-2 border-t border-gray-200 bg-gray-50 px-4 py-2 text-[11px] text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <div className="min-w-0">
        <div className="uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Characters
        </div>
        <div className={`mt-1 font-semibold tabular-nums ${TEXT_COLOR[tier]}`}>
          {stats.characters.toLocaleString()}
          {maxChars && (
            <span className="font-normal text-gray-400 dark:text-gray-500">
              /{maxChars.toLocaleString()}
            </span>
          )}
        </div>
        {maxChars && (
          <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all ${BAR_COLOR[tier]}`}
              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Words
        </div>
        <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
          {stats.words.toLocaleString()}
        </div>
      </div>
      <div className="min-w-0">
        <div className="uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Paragraphs
        </div>
        <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
          {stats.paragraphs.toLocaleString()}
        </div>
      </div>
    </footer>
  );
}
