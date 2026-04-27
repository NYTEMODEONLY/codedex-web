"use client";

import { useApp } from "@/lib/state";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Pokeball } from "@/components/Pokeball";

const FEATURES = [
  "Ultra-fast continuous QR scanning",
  "Batch processing of full booster boxes",
  "Numbered, space, comma, raw export",
  "One-click copy by block of 10",
  "TXT and Markdown file exports",
  "100% local — codes never leave your device",
];

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function AboutModal() {
  const { closeModal } = useApp();

  return (
    <Modal ariaLabel="About CodeDex Pro">
      <ModalHeader title="About" />

      <ModalBody>
        <div className="px-5 py-5">
          {/* Hero row */}
          <div className="flex items-center gap-4">
            <Pokeball size={52} />
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline">
                <span className="font-display text-[22px] font-bold text-text">
                  CodeDex
                </span>
                <span className="font-display text-[22px] font-bold text-yellow ml-1">
                  Pro
                </span>
              </div>
              <span className="font-mono text-[11px] text-text-muted tracking-[0.10em] mt-1">
                VERSION 1.4.2 · MIT LICENSE
              </span>
            </div>
          </div>

          <hr className="my-4 border-border" />

          {/* Description */}
          <p className="text-text-2 text-[13px] leading-relaxed">
            The professional Pokémon TCG code scanner — built by collectors,
            for collectors. Scan, organize, and export hundreds of redemption
            codes at lightning speed without ever leaving your desk.
          </p>

          {/* Feature list */}
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-5">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-text-2 text-[13px] leading-snug"
              >
                <span
                  aria-hidden
                  className="bg-yellow rounded-full mt-1.5 shrink-0"
                  style={{ width: 6, height: 6 }}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Credits panel */}
          <div className="bg-surface-2 border border-border rounded-xl px-4 py-3.5 flex gap-3 items-start mt-4">
            <MoonIcon className="text-yellow shrink-0 mt-0.5" />
            <p className="text-text-2 text-[12px] leading-relaxed">
              CodeDex Pro is a{" "}
              <a
                href="https://nytemode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow hover:underline"
              >
                nytemode
              </a>{" "}
              project. Pokémon is a trademark of Nintendo, Creatures Inc., and
              GAME FREAK Inc. — this app is unofficial and unaffiliated.
            </p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={closeModal}
          className="bg-red text-white hover:bg-red-soft border border-red rounded-lg px-4 h-10 font-body font-semibold text-[13px] transition-colors"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}
