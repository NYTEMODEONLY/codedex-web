"use client";

import { useState } from "react";
import { useApp } from "@/lib/state";
import {
  downloadBlob,
  exportMarkdown,
  FORMAT_RAW,
} from "@/lib/format";
import { SectionTitle } from "./SectionTitle";
import { CodesList } from "./CodesList";
import { CodeBlocksTab } from "./CodeBlocksTab";

type Tab = "all" | "blocks";

export function CodesCard() {
  const { state, dispatch, openModal, showToast } = useApp();
  const [tab, setTab] = useState<Tab>("all");
  const total = state.codes.length;
  const blocks = total === 0 ? 0 : Math.ceil(total / 10);
  const empty = total === 0;

  function copyAll() {
    if (empty) {
      showToast("Nothing to copy yet", { success: false });
      return;
    }
    navigator.clipboard
      .writeText(state.codes.map((c) => c.value).join("\n"))
      .then(() => showToast(`Copied ${total} codes`));
  }

  function exportTxt() {
    if (empty) return;
    downloadBlob(
      state.codes.map((c) => c.value).join("\n") + "\n",
      "pokemon_tcg_codes.txt"
    );
    showToast(`Exported ${total} codes (TXT)`);
  }

  function exportMd() {
    if (empty) return;
    downloadBlob(
      exportMarkdown(state.codes.map((c) => c.value), FORMAT_RAW),
      "pokemon_tcg_codes.md"
    );
    showToast(`Exported ${total} codes (MD)`);
  }

  function clear() {
    if (empty) return;
    if (
      window.confirm(
        `Remove all ${total} captured codes?\nYou can undo with ⌘Z.`
      )
    ) {
      dispatch({ type: "CLEAR" });
      showToast("Cleared all codes — ⌘Z to undo", { success: false });
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-surface p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <SectionTitle text="Codes" accent="yellow" />
        <div className="flex-1" />
        <span className="rounded-full border border-yellow/30 bg-yellow/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-yellow">
          {total} captured
        </span>
      </div>

      {/* Tabs */}
      <div className="mt-3.5 flex border-b border-border">
        <TabButton
          active={tab === "all"}
          onClick={() => setTab("all")}
          label="All Codes"
          count={total}
        />
        <TabButton
          active={tab === "blocks"}
          onClick={() => setTab("blocks")}
          label="Code Blocks"
          count={blocks}
        />
      </div>

      {/* Tab content */}
      {tab === "all" ? (
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 pt-3.5">
          <CodesList />
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openModal("addCode")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red bg-red px-4 font-body text-[13px] font-semibold text-white hover:bg-red-soft hover:border-red-soft"
            >
              <PlusIcon />
              Add Code
            </button>
            <div className="flex-1" />
            <button
              onClick={copyAll}
              disabled={empty}
              className="h-9 rounded-lg border border-border bg-surface-2 px-3.5 font-body text-[13px] font-semibold text-text hover:bg-surface-3 hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy All
            </button>
            <button
              onClick={exportTxt}
              disabled={empty}
              className="h-9 rounded-lg border border-yellow bg-yellow px-3.5 font-body text-[13px] font-semibold text-[#1A1A22] hover:bg-yellow-soft hover:border-yellow-soft disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-disabled disabled:border-border"
            >
              Export TXT
            </button>
            <button
              onClick={exportMd}
              disabled={empty}
              className="h-9 rounded-lg border border-yellow bg-yellow px-3.5 font-body text-[13px] font-semibold text-[#1A1A22] hover:bg-yellow-soft hover:border-yellow-soft disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-disabled disabled:border-border"
            >
              Export MD
            </button>
            <button
              onClick={clear}
              disabled={empty}
              className="h-9 rounded-lg border border-border bg-transparent px-3.5 font-body text-[13px] font-semibold text-text-2 hover:bg-surface-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <CodeBlocksTab />
      )}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3.5 pb-3 pt-2.5 font-body text-[13px] font-semibold transition-colors ${
        active
          ? "text-yellow"
          : "text-text-muted hover:text-text"
      }`}
    >
      {label}
      <span
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 font-mono text-[10px] font-bold ${
          active
            ? "border-yellow/30 bg-yellow/10 text-yellow"
            : "border-border bg-surface-2 text-text-2"
        }`}
      >
        {count}
      </span>
      {active && (
        <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-sm bg-yellow" />
      )}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
