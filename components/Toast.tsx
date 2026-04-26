"use client";

import { useApp } from "@/lib/state";

export function Toast() {
  const { state } = useApp();
  const toast = state.toast;
  if (!toast) return null;

  const showCheck = toast.success !== false;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-surface-3/95 backdrop-blur-md border border-border-strong px-5 py-3 font-body text-[13px] font-semibold text-text flex items-center gap-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
      style={{ animation: "toast-in 0.25s ease-out" }}
    >
      {showCheck && (
        <span
          aria-hidden
          className="bg-success text-white rounded-full inline-flex items-center justify-center text-[11px] font-black"
          style={{ width: 18, height: 18 }}
        >
          ✓
        </span>
      )}
      <span>
        {toast.message}
        {toast.code && (
          <>
            {" "}
            <span aria-hidden>·</span>{" "}
            <span className="font-mono text-yellow">{toast.code}</span>
          </>
        )}
      </span>
    </div>
  );
}
