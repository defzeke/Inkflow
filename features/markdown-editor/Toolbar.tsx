"use client";

import { useState } from "react";
import { HamburgerIcon, MoonIcon, SunIcon, XIcon } from "./components";
import { APP_NAME, PREVIEW_RENDERERS, type PreviewRenderer } from "./constants";

interface ToolbarProps {
  isDark: boolean;
  onToggleDark: () => void;
  renderer: PreviewRenderer;
  onRendererChange: (renderer: PreviewRenderer) => void;
  syncScroll: boolean;
  onToggleSyncScroll: () => void;
  onPublish: () => void;
}

export function Toolbar({
  isDark,
  onToggleDark,
  renderer,
  onRendererChange,
  syncScroll,
  onToggleSyncScroll,
  onPublish,
}: ToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>

        {/* Desktop controls */}
        <div className="hidden sm:flex items-center gap-3">
          <div
            className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1"
            role="group"
            aria-label="Preview renderer"
          >
            {PREVIEW_RENDERERS.map((option) => {
              const isActive = option.value === renderer;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRendererChange(option.value)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onToggleSyncScroll}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              syncScroll
                ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
            aria-pressed={syncScroll}
          >
            {syncScroll ? "Linked Scroll" : "Free Scroll"}
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition-opacity"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="sm:hidden p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <XIcon /> : <HamburgerIcon />}
        </button>
      </header>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div
            className="flex rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1"
            role="group"
            aria-label="Preview renderer"
          >
            {PREVIEW_RENDERERS.map((option) => {
              const isActive = option.value === renderer;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onRendererChange(option.value);
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 rounded px-2.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              onPublish();
              setIsMenuOpen(false);
            }}
            className="w-full px-3 py-2 text-xs font-semibold rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition-opacity"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      )}
    </>
  );
}
