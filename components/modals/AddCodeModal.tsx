"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/state";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";

export function AddCodeModal() {
  const { addCode, closeModal } = useApp();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Slight delay so the modal-in animation doesn't fight the focus.
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, []);

  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const ok = addCode(trimmed, "manual");
    if (ok) {
      closeModal();
    }
    // If duplicate, keep modal open — addCode shows a toast.
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Modal ariaLabel="Add code manually" slim>
      <ModalHeader title="Add Code Manually" />

      <ModalBody>
        <div className="px-5 py-5">
          <label
            htmlFor="manual-code-input"
            className="block font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-text-2 mb-2"
          >
            Pokémon TCG Code
          </label>
          <input
            ref={inputRef}
            id="manual-code-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            className="font-mono text-[14px] uppercase tracking-[0.08em] bg-input border border-border rounded-lg px-3.5 py-3 text-text placeholder:text-text-muted focus:border-yellow focus:outline-none w-full"
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={closeModal}
          className="bg-transparent text-text-2 border border-border hover:bg-surface-2 hover:text-text rounded-lg px-4 h-10 font-body font-semibold text-[13px] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="bg-red text-white hover:bg-red-soft border border-red rounded-lg px-4 h-10 font-body font-semibold text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red"
        >
          Add Code
        </button>
      </ModalFooter>
    </Modal>
  );
}
