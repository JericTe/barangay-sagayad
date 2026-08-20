"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

const SIZES = ["normal", "large", "xlarge"] as const;
type Size = (typeof SIZES)[number];
const STORAGE_KEY = "sagayad-text-size";

function apply(size: Size) {
  document.documentElement.dataset.textSize = size;
}

export function TextSizeToggle() {
  const [size, setSize] = React.useState<Size>("normal");

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Size | null;
    if (saved && SIZES.includes(saved)) {
      // Genuine sync-from-external-system-on-mount case (localStorage isn't
      // available during render/SSR) — the sanctioned use of an Effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSize(saved);
      apply(saved);
    }
  }, []);

  function change(next: Size) {
    setSize(next);
    apply(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const index = SIZES.indexOf(size);

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-line bg-paper-raised p-1"
      role="group"
      aria-label="Adjust text size"
    >
      <button
        type="button"
        onClick={() => change(SIZES[Math.max(0, index - 1)])}
        disabled={index === 0}
        aria-label="Decrease text size"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-brand-100 disabled:opacity-30"
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <span className="px-1 text-xs font-semibold text-ink-soft" aria-hidden="true">
        Aa
      </span>
      <button
        type="button"
        onClick={() => change(SIZES[Math.min(SIZES.length - 1, index + 1)])}
        disabled={index === SIZES.length - 1}
        aria-label="Increase text size"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-brand-100 disabled:opacity-30"
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
