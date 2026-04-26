"use client";

const ENERGY_TYPES = [
  "var(--color-en-fire)",
  "var(--color-en-water)",
  "var(--color-en-grass)",
  "var(--color-en-electric)",
  "var(--color-en-psychic)",
  "var(--color-en-fairy)",
] as const;

/**
 * Decorative pip strip rendered in the header on desktop.
 * Six rotated-45deg rounded squares colored by energy type.
 * Pure decoration — no interaction.
 */
export function EnergyStrip() {
  return (
    <div
      aria-hidden
      className="hidden lg:flex items-center gap-1.5 opacity-50"
    >
      {ENERGY_TYPES.map((color, i) => (
        <span
          key={i}
          className="block"
          style={{
            width: 10,
            height: 10,
            background: color,
            transform: "rotate(45deg)",
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
