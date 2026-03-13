interface PaneHeaderProps {
  label: string;
}

export function PaneHeader({ label }: PaneHeaderProps) {
  return (
    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
      {label}
    </div>
  );
}
