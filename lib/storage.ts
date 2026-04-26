"use client";

import type { Code, Settings } from "@/types";

const SESSION_KEY = "codedex.session.v1";
const SETTINGS_KEY = "codedex.settings.v1";

export const DEFAULT_SETTINGS: Settings = {
  cameraId: null,
  autoDetect: true,
  scanIntervalMs: 250,
  cooldownSec: 1.5,
  flash: true,
  sound: false,
};

export function loadCodes(): Code[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c): c is Code =>
          c &&
          typeof c.value === "string" &&
          (c.source === "scan" || c.source === "manual") &&
          typeof c.capturedAt === "number"
      )
      .map((c) => ({ ...c, value: c.value.toUpperCase() }));
  } catch {
    return [];
  }
}

export function saveCodes(codes: Code[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(codes));
  } catch {
    /* localStorage full or disabled — not fatal */
  }
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* non-fatal */
  }
}
