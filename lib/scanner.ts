"use client";

import QrScanner from "qr-scanner";

export interface CodeScannerOptions {
  /** Cooldown in ms — same code returned within this window is suppressed. */
  cooldownMs?: number;
  /** Specific camera deviceId, or null for environment-facing default. */
  cameraId?: string | null;
  /** Frames-per-second cap for QR scanning. Default 10. */
  maxScansPerSecond?: number;
}

/**
 * Thin wrapper around `qr-scanner` that adds a per-code cooldown.
 *
 * Usage:
 *   const scanner = new CodeScanner(videoEl, (value) => addCode(value, "scan"));
 *   await scanner.start();
 *   ...
 *   scanner.stop();
 */
export class CodeScanner {
  private qr: QrScanner;
  private onDecode: (value: string) => void;
  private cooldownMs: number;
  private lastValue: string | null = null;
  private lastValueAt = 0;
  private cameraId: string | null;

  constructor(
    videoEl: HTMLVideoElement,
    onDecode: (value: string) => void,
    options: CodeScannerOptions = {}
  ) {
    this.onDecode = onDecode;
    this.cooldownMs = options.cooldownMs ?? 1500;
    this.cameraId = options.cameraId ?? null;

    this.qr = new QrScanner(
      videoEl,
      (result) => this.handleResult(result.data),
      {
        highlightScanRegion: false,
        highlightCodeOutline: false,
        returnDetailedScanResult: true,
        maxScansPerSecond: options.maxScansPerSecond ?? 10,
        preferredCamera: this.cameraId || "environment",
      }
    );
  }

  private handleResult(value: string): void {
    const now = Date.now();
    if (
      this.lastValue === value &&
      now - this.lastValueAt < this.cooldownMs
    ) {
      // Same code within cooldown window — suppress.
      return;
    }
    this.lastValue = value;
    this.lastValueAt = now;
    this.onDecode(value);
  }

  /** Start the underlying QrScanner. May reject if camera permission denied. */
  async start(): Promise<void> {
    await this.qr.start();
  }

  /** Stop scanning and release the camera stream. */
  stop(): void {
    this.qr.stop();
  }

  /** Update cooldown at runtime (e.g. when user changes settings). */
  setCooldown(ms: number): void {
    this.cooldownMs = ms;
  }

  /**
   * Switch to a different camera. Pass null to fall back to the
   * environment-facing default. Restarts the underlying scanner.
   */
  async setCamera(deviceId: string | null): Promise<void> {
    this.cameraId = deviceId;
    await this.qr.setCamera(deviceId || "environment");
  }

  /**
   * One-shot scan request. The library doesn't expose a public scanFrame()
   * so we briefly bypass the cooldown for the next detection by clearing
   * lastValue. Real detection still happens via the running event loop.
   */
  forceNextScan(): void {
    this.lastValue = null;
    this.lastValueAt = 0;
  }

  /** Fully tear down — call when the component unmounts. */
  destroy(): void {
    this.qr.destroy();
  }
}
