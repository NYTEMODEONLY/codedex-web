"use client";

import { Pokeball } from "./Pokeball";

interface EmptyStateProps {
  title: string;
  hint: string;
  size?: number;
}

export function EmptyState({ title, hint, size = 68 }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3.5 rounded-xl border-[1.5px] border-dashed border-border-strong bg-input p-9 text-center">
      <div className="opacity-50">
        <Pokeball size={size} watermark />
      </div>
      <h4 className="font-display text-base font-semibold text-text">{title}</h4>
      <p className="max-w-[320px] text-[13px] leading-relaxed text-text-muted">
        {hint}
      </p>
    </div>
  );
}
