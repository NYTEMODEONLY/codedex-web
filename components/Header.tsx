"use client";

import { useApp } from "@/lib/state";
import { useTally } from "@/lib/useTally";
import { Pokeball } from "@/components/Pokeball";
import { EnergyStrip } from "@/components/EnergyStrip";

const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact" });
const fullNumber = new Intl.NumberFormat("en-US");

function InfoIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Header() {
  const { state, openModal } = useApp();
  const { total: globalTotal, error: globalError } = useTally();
  const count = state.codes.length;
  const globalReady = globalTotal !== null && !globalError;

  const badgeText =
    count === 0
      ? "NO CODES YET"
      : count === 1
        ? "1 CODE CAPTURED"
        : `${count} CODES CAPTURED`;

  return (
    <header className="flex items-center gap-3 px-5 py-3.5 lg:px-7 border-b border-border bg-surface shrink-0">
      {/* Brand mark + stack */}
      <div className="flex items-center gap-3">
        {/* Mobile: 32px */}
        <span className="lg:hidden">
          <Pokeball size={32} />
        </span>
        {/* Desktop: 42px */}
        <span className="hidden lg:inline-block">
          <Pokeball size={42} />
        </span>

        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span className="font-display text-[22px] font-bold text-text">
              CodeDex
            </span>
            <span className="font-display text-[22px] font-medium text-yellow ml-1">
              Pro
            </span>
          </div>
          <span className="hidden lg:inline-block font-mono text-[9px] tracking-[0.22em] text-text-muted uppercase mt-1">
            POKÉMON · TCG CODE SCANNER
          </span>
        </div>
      </div>

      {/* Decorative pips — desktop only */}
      <EnergyStrip />

      <div className="flex-1" />

      {/* Global tally — live counter from Upstash. Hidden on the smallest
          mobile screens to avoid header crowding. */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openModal("about");
        }}
        title={
          globalReady
            ? `${fullNumber.format(globalTotal)} codes scanned globally with CodeDex Pro`
            : "Loading global scan count…"
        }
        className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-scan/10 text-scan border border-scan/35 font-mono text-[11px] font-bold tracking-[0.08em] uppercase no-underline hover:bg-scan/15 hover:border-scan/55 transition-colors"
        aria-label={
          globalReady
            ? `${fullNumber.format(globalTotal)} codes scanned globally`
            : "Global scan count loading"
        }
      >
        <span
          aria-hidden
          className="block rounded-full bg-scan [animation:pulse-ring_1.6s_ease-in-out_infinite]"
          style={{
            width: 6,
            height: 6,
            boxShadow: "0 0 6px rgba(90, 200, 250, 0.8)",
          }}
        />
        {globalReady ? (
          <>
            <span className="hidden lg:inline">
              {fullNumber.format(globalTotal)} SCANNED
            </span>
            <span className="lg:hidden">
              {compactNumber.format(globalTotal)}
            </span>
          </>
        ) : (
          <span className="opacity-60">— SCANNED</span>
        )}
      </a>

      {/* Yellow count badge */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow/10 text-yellow border border-yellow/40 font-mono text-[11px] font-bold tracking-[0.08em] uppercase"
        aria-label={`${count} codes captured`}
      >
        <span
          aria-hidden
          className="block bg-yellow rounded-full"
          style={{
            width: 6,
            height: 6,
            boxShadow: "0 0 6px rgba(255, 203, 5, 0.7)",
          }}
        />
        {/* On mobile, just show the number; on desktop the verbose text */}
        <span className="hidden md:inline">{badgeText}</span>
        <span className="md:hidden">{count}</span>
      </div>

      {/* Icon buttons */}
      <button
        type="button"
        onClick={() => openModal("about")}
        aria-label="About"
        className="inline-flex items-center justify-center w-[38px] h-[38px] bg-surface-2 border border-border rounded-lg text-text-2 hover:bg-surface-3 hover:text-text hover:border-border-strong transition-colors"
      >
        <InfoIcon />
      </button>
      <button
        type="button"
        onClick={() => openModal("settings")}
        aria-label="Settings"
        className="inline-flex items-center justify-center w-[38px] h-[38px] bg-surface-2 border border-border rounded-lg text-text-2 hover:bg-surface-3 hover:text-text hover:border-border-strong transition-colors"
      >
        <GearIcon />
      </button>
    </header>
  );
}
