"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/state";
import { CodeRow } from "./CodeRow";
import { EmptyState } from "./EmptyState";

export function CodesList() {
  const { state } = useApp();
  const listRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom when a new code is added
  const lastCount = useRef(state.codes.length);
  useEffect(() => {
    if (state.codes.length > lastCount.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    lastCount.current = state.codes.length;
  }, [state.codes.length]);

  if (state.codes.length === 0) {
    return (
      <EmptyState
        title="No codes captured yet"
        hint="Press Start Camera to begin scanning, or use Add Code to enter one manually."
      />
    );
  }

  return (
    <div className="scrollable flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-input p-1.5">
      <div ref={listRef} className="scrollable flex-1 overflow-y-auto">
        {state.codes.map((code, i) => (
          <CodeRow key={code.value} index={i + 1} code={code} />
        ))}
      </div>
    </div>
  );
}
