"use client";

import { useState } from "react";
import { useApp } from "@/lib/state";
import {
  blockCount,
  blockSlice,
  downloadBlob,
  exportMarkdown,
  formatCodes,
  FORMATS,
  type FormatKind,
} from "@/lib/format";

const ALL_CODES_LABEL = "All Codes (Complete Export)";

export function CodeBlocksTab() {
  const { state, showToast } = useApp();
  const [block, setBlock] = useState(0);
  const [fmt, setFmt] = useState<FormatKind>(FORMATS[0]);

  const total = state.codes.length;
  const blocks = blockCount(total);
  const slice = blockSlice(state.codes, block);
  const blockText = formatCodes(
    slice.codes.map((c) => c.value),
    slice.startIdx,
    fmt
  );
  const empty = slice.codes.length === 0;

  const blockLabel =
    block === 0
      ? "All Codes"
      : `Block ${block}`;

  function copyBlock() {
    if (empty) return;
    navigator.clipboard.writeText(blockText).then(() => {
      showToast(`Copied ${blockLabel}`, {
        code: `${slice.codes.length} codes`,
      });
    });
  }

  function exportTxt() {
    if (empty) return;
    downloadBlob(
      slice.codes.map((c) => c.value).join("\n") + "\n",
      "pokemon_tcg_codes.txt"
    );
    showToast(`Exported ${slice.codes.length} codes (TXT)`);
  }

  function exportMd() {
    if (empty) return;
    downloadBlob(
      exportMarkdown(slice.codes.map((c) => c.value), fmt),
      "pokemon_tcg_codes.md"
    );
    showToast(`Exported ${slice.codes.length} codes (MD)`);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3.5 pt-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-text-2">
            Block
          </label>
          <select
            value={block}
            onChange={(e) => setBlock(parseInt(e.target.value, 10))}
            disabled={total === 0}
            className="h-10 cursor-pointer rounded-lg border border-border bg-input px-3 font-body text-[13px] text-text hover:border-border-strong focus:border-yellow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={0}>{ALL_CODES_LABEL}</option>
            {Array.from({ length: blocks }, (_, i) => {
              const start = i * 10 + 1;
              const end = Math.min(start + 9, total);
              return (
                <option key={i} value={i + 1}>
                  Block {i + 1} · {start}–{end}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-text-2">
            Format
          </label>
          <select
            value={fmt}
            onChange={(e) => setFmt(e.target.value as FormatKind)}
            className="h-10 cursor-pointer rounded-lg border border-border bg-input px-3 font-body text-[13px] text-text hover:border-border-strong focus:border-yellow focus:outline-none"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <pre
        className={`scrollable min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-input px-4 py-3.5 font-mono text-[13px] leading-relaxed ${
          empty ? "italic text-text-muted" : "text-text"
        }`}
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {empty ? "Capture some codes and they'll appear here." : blockText}
      </pre>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={copyBlock}
          disabled={empty}
          className="h-9 rounded-lg border border-red bg-red px-4 font-body text-[13px] font-semibold text-white hover:bg-red-soft hover:border-red-soft disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-disabled disabled:border-border"
        >
          Copy Block
        </button>
        <button
          onClick={exportTxt}
          disabled={empty}
          className="h-9 rounded-lg border border-yellow bg-yellow px-4 font-body text-[13px] font-semibold text-[#1A1A22] hover:bg-yellow-soft hover:border-yellow-soft disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-disabled disabled:border-border"
        >
          Export TXT
        </button>
        <button
          onClick={exportMd}
          disabled={empty}
          className="h-9 rounded-lg border border-yellow bg-yellow px-4 font-body text-[13px] font-semibold text-[#1A1A22] hover:bg-yellow-soft hover:border-yellow-soft disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-disabled disabled:border-border"
        >
          Export MD
        </button>
      </div>
    </div>
  );
}
