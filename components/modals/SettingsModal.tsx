"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/state";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Toggle } from "@/components/Toggle";
import type { Settings } from "@/types";

export function SettingsModal() {
  const { state, setSettings, closeModal } = useApp();

  // Local draft so Cancel reverts.
  const [draft, setDraft] = useState<Settings>(state.settings);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  // Enumerate cameras on mount.
  useEffect(() => {
    let cancelled = false;
    async function loadDevices() {
      try {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices ||
          typeof navigator.mediaDevices.enumerateDevices !== "function"
        ) {
          return;
        }
        const all = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        setDevices(all.filter((d) => d.kind === "videoinput"));
      } catch {
        /* permission may be required to label devices; ignore */
      }
    }
    loadDevices();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (patch: Partial<Settings>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const onSave = () => {
    setSettings({ ...draft });
    closeModal();
  };

  const onCancel = () => {
    // Revert any live-applied draft (we kept it local, so simply close).
    closeModal();
  };

  return (
    <Modal ariaLabel="Settings">
      <ModalHeader title="Settings" />

      <ModalBody>
        <div className="px-5 py-5 space-y-3.5">
          {/* Group 1 — CAMERA */}
          <section className="bg-surface-2 border border-border rounded-xl px-4 py-4">
            <h4 className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-yellow mb-2.5">
              Camera
            </h4>

            <div className="flex items-center justify-between gap-3 py-2 border-b border-border">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text font-medium">
                  Camera device
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  Pick which camera the scanner uses.
                </div>
              </div>
              <select
                value={draft.cameraId ?? ""}
                onChange={(e) =>
                  update({ cameraId: e.target.value === "" ? null : e.target.value })
                }
                className="bg-input border border-border rounded-lg px-3 py-2 text-text-2 font-body text-[13px] focus:border-yellow focus:outline-none max-w-[230px]"
                aria-label="Camera device"
              >
                <option value="">Auto-detect (default)</option>
                {devices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text font-medium">
                  Auto-detect QR codes
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  Continuously scan frames in the background.
                </div>
              </div>
              <Toggle
                checked={draft.autoDetect}
                onChange={(v) => update({ autoDetect: v })}
                aria-label="Auto-detect QR codes"
              />
            </div>
          </section>

          {/* Group 2 — SCAN BEHAVIOR */}
          <section className="bg-surface-2 border border-border rounded-xl px-4 py-4">
            <h4 className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-yellow mb-2.5">
              Scan Behavior
            </h4>

            <div className="flex items-center justify-between gap-3 py-2 border-b border-border">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text font-medium">
                  Scan interval
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  How often the scanner inspects a frame (ms).
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={100}
                  max={2000}
                  step={50}
                  value={draft.scanIntervalMs}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (Number.isFinite(n)) update({ scanIntervalMs: n });
                  }}
                  className="bg-input border border-border rounded-lg px-3 py-2 text-text font-mono text-[13px] w-[110px] text-right focus:border-yellow focus:outline-none"
                  aria-label="Scan interval (ms)"
                />
                <span className="font-mono text-[11px] text-text-muted">ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text font-medium">
                  Cooldown after scan
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  Pause before re-detecting the same code (sec).
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0.5}
                  max={10}
                  step={0.1}
                  value={draft.cooldownSec}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value);
                    if (Number.isFinite(n)) update({ cooldownSec: n });
                  }}
                  className="bg-input border border-border rounded-lg px-3 py-2 text-text font-mono text-[13px] w-[110px] text-right focus:border-yellow focus:outline-none"
                  aria-label="Cooldown after scan (seconds)"
                />
                <span className="font-mono text-[11px] text-text-muted">sec</span>
              </div>
            </div>
          </section>

          {/* Group 3 — CAPTURE & SOUND */}
          <section className="bg-surface-2 border border-border rounded-xl px-4 py-4">
            <h4 className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-yellow mb-2.5">
              Capture &amp; Sound
            </h4>

            <div className="flex items-center justify-between gap-3 py-2 border-b border-border">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text font-medium">
                  Success flash
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  Briefly flash the viewport when a code is captured.
                </div>
              </div>
              <Toggle
                checked={draft.flash}
                onChange={(v) => update({ flash: v })}
                aria-label="Success flash"
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text font-medium">
                  Sound effects
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  Play a soft tone on capture (deferred).
                </div>
              </div>
              <Toggle
                checked={draft.sound}
                onChange={(v) => update({ sound: v })}
                aria-label="Sound effects"
              />
            </div>
          </section>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent text-text-2 border border-border hover:bg-surface-2 hover:text-text rounded-lg px-4 h-10 font-body font-semibold text-[13px] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="bg-red text-white hover:bg-red-soft border border-red rounded-lg px-4 h-10 font-body font-semibold text-[13px] transition-colors"
        >
          Save
        </button>
      </ModalFooter>
    </Modal>
  );
}
