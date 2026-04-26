"use client";

import type { Code } from "@/types";

interface CodeRowProps {
  index: number;
  code: Code;
}

export function CodeRow({ index, code }: CodeRowProps) {
  const isScan = code.source === "scan";
  const dotColor = isScan ? "bg-success" : "bg-text-muted";
  const tooltip = isScan ? "Scanned via camera" : "Added manually";

  return (
    <div className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-md px-3 py-2.5 text-text hover:bg-scan/5">
      <div className="text-right font-mono text-[11px] tracking-[0.06em] text-text-muted">
        #{String(index).padStart(3, "0")}
      </div>
      <div
        className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[13px] tracking-[0.04em] text-text"
        style={{ userSelect: "text" }}
      >
        {code.value}
      </div>
      <div
        className={`h-4 w-4 shrink-0 rounded-full border-[1.5px] border-white/15 ${dotColor}`}
        title={tooltip}
        aria-label={tooltip}
      />
    </div>
  );
}
