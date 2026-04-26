"use client";

import { cn } from "@/lib/cn";

interface PokeballProps {
  size?: number;
  watermark?: boolean;
  className?: string;
}

/**
 * Original CSS-rendered Pokéball-inspired mark — gradients only,
 * no trademarked artwork.
 */
export function Pokeball({ size = 42, watermark, className }: PokeballProps) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block shrink-0", className)}
      style={{
        width: size,
        height: size,
        opacity: watermark ? 0.2 : 1,
      }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.55), transparent 38%), linear-gradient(180deg, var(--color-red) 0% 48%, #fff 52% 100%)",
          boxShadow:
            "inset 0 0 0 2px var(--color-bg), inset 0 -1px 0 rgba(0,0,0,0.3), 0 4px 18px rgba(230,57,70,0.25)",
        }}
      />
      {/* equator band */}
      <span
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
        style={{ height: Math.max(2, size * 0.07), background: "var(--color-bg)" }}
      />
      {/* center button */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: size * 0.32,
          height: size * 0.32,
          marginLeft: -(size * 0.16),
          marginTop: -(size * 0.16),
          background: "#fff",
          boxShadow:
            "inset 0 0 0 2.5px var(--color-bg), inset 0 0 0 5px #fff, inset 0 0 0 6.5px var(--color-bg)",
        }}
      />
    </span>
  );
}
