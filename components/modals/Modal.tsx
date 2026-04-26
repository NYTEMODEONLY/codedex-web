"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/state";
import { cn } from "@/lib/cn";

interface ModalProps {
  children: React.ReactNode;
  ariaLabel: string;
  slim?: boolean;
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Base modal shell. Renders an overlay + animated panel.
 * Click outside or Esc closes via closeModal().
 * Provides focus management on mount.
 */
export function Modal({ children, ariaLabel, slim = false }: ModalProps) {
  const { closeModal } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the first focusable element inside the panel on mount.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    // Defer focus to next tick so animation doesn't fight the focus ring.
    const id = window.setTimeout(() => focusable?.focus(), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm animate-[shade-in_0.2s_ease-out]"
      onClick={closeModal}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative bg-surface border border-border-strong rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-[modal-in_0.25s_cubic-bezier(0.2,0.9,0.3,1.2)]",
          slim ? "w-[min(420px,90vw)]" : "w-[min(560px,90vw)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
}

export function ModalHeader({ title }: ModalHeaderProps) {
  const { closeModal } = useApp();
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
      <h3 className="font-display text-base font-bold text-text flex-1">
        {title}
      </h3>
      <button
        type="button"
        onClick={closeModal}
        aria-label="Close"
        className="text-text-2 hover:text-text transition-colors inline-flex items-center justify-center"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

interface ModalFooterProps {
  children: React.ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border bg-surface-2">
      {children}
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("scrollable flex-1 min-h-0", className)}>{children}</div>
  );
}
