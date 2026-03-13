"use client";

import { useState, useEffect } from "react";
import { formatCountdown } from "@/libs/time";

export function ExpiryCountdown({ expiresAt }: { expiresAt: number }) {
  const [remaining, setRemaining] = useState(() => expiresAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(expiresAt - Date.now()), 60_000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (remaining <= 0) return null;

  return (
    <span className="text-xs text-amber-500 tabular-nums">
      {formatCountdown(remaining)}
    </span>
  );
}
