"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/state";
import { CodeScanner } from "@/lib/scanner";
import { CameraView } from "@/components/CameraView";
import { SectionTitle } from "@/components/SectionTitle";
import { StatusIndicator, type StatusState } from "@/components/StatusIndicator";
import { cn } from "@/lib/cn";

export function ScannerCard() {
  const { state, dispatch, addCode } = useApp();
  const { cameraOn, settings } = state;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<CodeScanner | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const flashEnabledRef = useRef<boolean>(settings.flash);

  const [flashKey, setFlashKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Keep flash setting fresh inside the decode callback without
  // re-creating the scanner on every settings change.
  useEffect(() => {
    flashEnabledRef.current = settings.flash;
  }, [settings.flash]);

  // Push cooldown changes into the live scanner instance.
  useEffect(() => {
    if (scannerRef.current) {
      scannerRef.current.setCooldown(settings.cooldownSec * 1000);
    }
  }, [settings.cooldownSec]);

  const teardown = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => teardown();
  }, [teardown]);

  const handleStart = useCallback(async () => {
    setError(null);
    const videoEl = videoRef.current;
    if (!videoEl) return;
    try {
      // Acquire stream. We don't actually need to attach it manually
      // because qr-scanner's start() handles that internally — but
      // requesting it first surfaces permission errors more cleanly.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          deviceId: settings.cameraId
            ? { exact: settings.cameraId }
            : undefined,
        },
        audio: false,
      });
      // Stop the probe stream — qr-scanner will request its own.
      stream.getTracks().forEach((t) => t.stop());

      const scanner = new CodeScanner(
        videoEl,
        (value) => {
          const added = addCode(value, "scan");
          if (added && flashEnabledRef.current) {
            setFlashKey((k) => k + 1);
          }
        },
        {
          cooldownMs: settings.cooldownSec * 1000,
          cameraId: settings.cameraId,
          maxScansPerSecond: 10,
        }
      );
      scannerRef.current = scanner;
      await scanner.start();
      // qr-scanner manages the video.srcObject internally; track it for cleanup.
      streamRef.current = (videoEl.srcObject as MediaStream) ?? null;

      // Belt-and-braces: explicitly ensure the video is playing. qr-scanner
      // calls play() internally but the promise can be swallowed silently
      // (e.g. if the element was off-screen at the moment of attach), leaving
      // the element paused on a black frame.
      try {
        if (videoEl.paused) {
          await videoEl.play();
        }
      } catch {
        /* autoplay rejection — visible state will recover on next user gesture */
      }

      dispatch({ type: "SET_CAMERA_ON", on: true });
      dispatch({ type: "SET_SCANNING", scanning: true });
    } catch (err) {
      teardown();
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Camera access denied. Tap to retry."
          : err instanceof Error && err.name === "NotFoundError"
            ? "No camera detected on this device."
            : "Could not start camera. Tap to retry.";
      setError(msg);
      dispatch({ type: "SET_CAMERA_ON", on: false });
      dispatch({ type: "SET_SCANNING", scanning: false });
    }
  }, [addCode, dispatch, settings.cameraId, settings.cooldownSec, teardown]);

  const handleStop = useCallback(() => {
    teardown();
    dispatch({ type: "SET_CAMERA_ON", on: false });
    dispatch({ type: "SET_SCANNING", scanning: false });
    setError(null);
  }, [dispatch, teardown]);

  const handleScanNow = useCallback(() => {
    // Bypass cooldown for the next detection; the auto-scan loop will catch it.
    if (scannerRef.current) {
      scannerRef.current.forceNextScan();
    }
  }, []);

  const statusState: StatusState = error
    ? "off"
    : cameraOn
      ? state.scanning
        ? "scanning"
        : "live"
      : "off";

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <SectionTitle text="Scanner" accent="red" />
        <StatusIndicator state={statusState} />
      </div>

      {/* Camera viewport area */}
      <div
        className="relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border"
        style={{ backgroundColor: "#050507" }}
      >
        {error ? (
          <ErrorPane message={error} onRetry={handleStart} />
        ) : (
          <CameraView
            cameraOn={cameraOn}
            videoRef={videoRef}
            flashKey={flashKey}
          />
        )}
      </div>

      {/* Tip strip */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-yellow">
          [TIP]
        </span>
        <span className="font-body text-[12px] leading-snug text-text-2">
          Hold the QR code 6–12 inches from the lens with even lighting for fastest captures.
        </span>
      </div>

      {/* Controls row */}
      <div className="grid grid-cols-2 gap-3">
        {cameraOn ? (
          <button
            type="button"
            onClick={handleStop}
            className={cn(
              "min-h-10 rounded-lg px-4 font-semibold text-sm transition-colors",
              "bg-danger text-white hover:bg-[#FF6B62]"
            )}
          >
            Stop Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            className={cn(
              "min-h-10 rounded-lg px-4 font-semibold text-sm transition-colors",
              "bg-red text-white hover:bg-red-soft"
            )}
          >
            Start Camera
          </button>
        )}
        <button
          type="button"
          onClick={handleScanNow}
          disabled={!cameraOn}
          className={cn(
            "min-h-10 rounded-lg px-4 font-semibold text-sm transition-colors",
            cameraOn
              ? "bg-yellow text-[#1A1A22] hover:bg-yellow-soft"
              : "cursor-not-allowed border border-border bg-surface-2 text-text-disabled"
          )}
        >
          Scan Now
        </button>
      </div>
    </div>
  );
}

interface ErrorPaneProps {
  message: string;
  onRetry: () => void;
}

function ErrorPane({ message, onRetry }: ErrorPaneProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center"
      style={{ borderColor: "var(--color-danger)" }}
    >
      <div
        className="absolute inset-0 rounded-xl border-2 pointer-events-none"
        style={{ borderColor: "var(--color-danger)" }}
      />
      <p className="font-display text-[15px] font-semibold text-text">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-10 rounded-lg bg-red px-4 text-sm font-semibold text-white transition-colors hover:bg-red-soft"
      >
        Retry
      </button>
    </div>
  );
}
