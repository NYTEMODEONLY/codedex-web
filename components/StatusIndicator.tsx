"use client";

import { cn } from "@/lib/cn";

export type StatusState = "off" | "live" | "scanning";

interface StatusIndicatorProps {
  state: StatusState;
}

const LABELS: Record<StatusState, string> = {
  off: "CAMERA OFF",
  live: "LIVE",
  scanning: "SCANNING",
};

/**
 * Three-state status pill with halo ring + core dot + uppercase mono label.
 * Off uses muted gray; live uses success green; scanning uses scan cyan.
 * Live and scanning animate via the pulse-ring keyframe defined in globals.css.
 */
export function StatusIndicator({ state }: StatusIndicatorProps) {
  const isAnimated = state !== "off";

  // Tailwind text color drives currentColor for the halo's box-shadow,
  // and provides the core dot's fill via bg-* classes.
  const colorClass =
    state === "off"
      ? "text-text-muted"
      : state === "live"
        ? "text-success"
        : "text-scan";

  const dotBgClass =
    state === "off"
      ? "bg-text-muted"
      : state === "live"
        ? "bg-success"
        : "bg-scan";

  return (
    <div className={cn("flex items-center gap-2", colorClass)}>
      <span
        className="relative inline-flex h-3 w-3 items-center justify-center"
        aria-hidden
      >
        {/* Outer halo ring — 12x12, semi-transparent currentColor border,
            animates via pulse-ring keyframe when live/scanning. */}
        <span
          className={cn(
            "absolute inset-0 rounded-full border opacity-60",
            isAnimated && "[animation:pulse-ring_1.6s_ease-in-out_infinite]"
          )}
          style={{ borderColor: "currentColor" }}
        />
        {/* Inner core dot — 6x6, solid color */}
        <span
          className={cn("relative h-1.5 w-1.5 rounded-full", dotBgClass)}
        />
      </span>
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
        {LABELS[state]}
      </span>
    </div>
  );
}
