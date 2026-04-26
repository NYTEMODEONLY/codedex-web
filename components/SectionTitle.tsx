"use client";

import { cn } from "@/lib/cn";

interface SectionTitleProps {
  text: string;
  accent?: "red" | "yellow";
  className?: string;
}

export function SectionTitle({ text, accent = "red", className }: SectionTitleProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "h-[18px] w-1 rounded-sm",
          accent === "red" ? "bg-red" : "bg-yellow"
        )}
      />
      <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-text">
        {text}
      </h3>
    </div>
  );
}
