"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  "aria-label"?: string;
}

/**
 * Custom toggle switch — 40x24 track with sliding 16x16 knob.
 * Off: surface-3 track, muted knob.
 * On:  yellow/25 track, yellow knob.
 */
export function Toggle({ checked, onChange, "aria-label": ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-block cursor-pointer rounded-full border transition-colors",
        checked ? "bg-yellow/25 border-yellow" : "bg-surface-3 border-border"
      )}
      style={{ width: 40, height: 24 }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute rounded-full",
          checked ? "bg-yellow" : "bg-text-muted"
        )}
        style={{
          width: 16,
          height: 16,
          top: 3,
          left: checked ? 20 : 2,
          transition: "all 0.2s",
        }}
      />
    </button>
  );
}
