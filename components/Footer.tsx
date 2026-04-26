"use client";

import { useApp } from "@/lib/state";

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Footer() {
  const { openModal } = useApp();

  return (
    <footer className="flex items-center gap-3.5 px-5 py-2.5 lg:px-7 border-t border-border bg-surface shrink-0 font-mono text-[11px] tracking-[0.08em] uppercase text-text-muted">
      {/* Left side */}
      <span>V1.4.2</span>
      <span aria-hidden>·</span>
      <span
        aria-hidden
        className="block bg-success rounded-full"
        style={{
          width: 7,
          height: 7,
          boxShadow: "0 0 6px rgba(52, 199, 89, 0.7)",
        }}
      />
      <span className="hidden md:inline">LOCAL PROCESSING ONLY</span>

      <div className="flex-1" />

      {/* Right side */}
      <button
        type="button"
        onClick={() => openModal("about")}
        className="text-text-2 hover:text-yellow cursor-pointer transition-colors uppercase tracking-[0.08em] font-mono text-[11px]"
      >
        About
      </button>
      <span aria-hidden className="hidden md:inline">·</span>
      <a
        href="https://nytemode.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:inline text-text-2 hover:text-yellow cursor-pointer transition-colors"
      >
        Docs
      </a>
      <span aria-hidden>·</span>
      <MoonIcon className="text-yellow" />
      <span className="flex items-center gap-1">
        <span className="hidden md:inline">A</span>
        <a
          href="https://nytemode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-2 hover:text-yellow cursor-pointer transition-colors"
        >
          NYTEMODE
        </a>
        <span className="hidden md:inline">PROJECT</span>
      </span>
    </footer>
  );
}
