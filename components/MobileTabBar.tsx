"use client";

import { useApp } from "@/lib/state";
import { cn } from "@/lib/cn";

function CameraIcon({ className }: { className?: string }) {
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
      className={className}
      aria-hidden
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
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
      className={className}
      aria-hidden
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function MobileTabBar() {
  const { state, setMobileTab } = useApp();
  const active = state.mobileTab;
  const count = state.codes.length;

  return (
    <nav
      className="lg:hidden flex shrink-0 border-t border-border bg-surface px-2"
      aria-label="Mobile navigation"
    >
      <button
        type="button"
        onClick={() => setMobileTab("scanner")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3.5 font-body text-sm font-semibold transition-colors border-b-2",
          active === "scanner"
            ? "text-yellow border-yellow"
            : "text-text-muted border-transparent"
        )}
        aria-current={active === "scanner" ? "page" : undefined}
      >
        <CameraIcon />
        <span>Scanner</span>
      </button>
      <button
        type="button"
        onClick={() => setMobileTab("codes")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3.5 font-body text-sm font-semibold transition-colors border-b-2",
          active === "codes"
            ? "text-yellow border-yellow"
            : "text-text-muted border-transparent"
        )}
        aria-current={active === "codes" ? "page" : undefined}
      >
        <ListIcon />
        <span>Codes</span>
        {count > 0 && (
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow/15 text-yellow text-[10px] font-bold px-1.5">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}
