"use client";

import { useEffect } from "react";
import { useApp } from "./state";
import { downloadBlob, exportMarkdown, FORMAT_RAW } from "./format";

export function useKeyboardShortcuts() {
  const { state, dispatch, openModal, showToast } = useApp();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      // skip when user is typing in an input
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as HTMLElement).isContentEditable)
      ) {
        return;
      }
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "z") {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }
      if (meta && e.key === ",") {
        e.preventDefault();
        openModal("settings");
        return;
      }
      if (meta && e.key === "n") {
        e.preventDefault();
        openModal("addCode");
        return;
      }
      if (meta && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        if (state.codes.length === 0) {
          showToast("Nothing to copy yet", { success: false });
          return;
        }
        navigator.clipboard
          .writeText(state.codes.map((c) => c.value).join("\n"))
          .then(() => showToast(`Copied ${state.codes.length} codes`));
        return;
      }
      if (meta && e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        if (state.codes.length === 0) return;
        downloadBlob(
          exportMarkdown(state.codes.map((c) => c.value), FORMAT_RAW),
          "pokemon_tcg_codes.md"
        );
        showToast(`Exported ${state.codes.length} codes (MD)`);
        return;
      }
      if (meta && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        if (state.codes.length === 0) return;
        downloadBlob(
          state.codes.map((c) => c.value).join("\n") + "\n",
          "pokemon_tcg_codes.txt"
        );
        showToast(`Exported ${state.codes.length} codes (TXT)`);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.codes, dispatch, openModal, showToast]);
}
