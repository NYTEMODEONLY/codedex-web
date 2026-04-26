"use client";

import { AppProvider, useApp } from "@/lib/state";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScannerCard } from "@/components/ScannerCard";
import { CodesCard } from "@/components/CodesCard";
import { Toast } from "@/components/Toast";
import { MobileTabBar } from "@/components/MobileTabBar";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { AboutModal } from "@/components/modals/AboutModal";
import { AddCodeModal } from "@/components/modals/AddCodeModal";
import { useKeyboardShortcuts } from "@/lib/shortcuts";

export function AppShell() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}

function Inner() {
  const { state } = useApp();
  useKeyboardShortcuts();

  return (
    <div className="relative flex h-dvh w-full flex-col">
      <Header />

      {/* Body — desktop two-column, mobile single-column with tabs */}
      <main className="relative flex min-h-0 flex-1 flex-col gap-5 px-5 py-5 lg:grid lg:grid-cols-[5fr_6fr] lg:gap-5 lg:px-7 lg:py-5">
        <div
          className={
            // On mobile, hide whichever panel isn't selected
            (state.mobileTab === "scanner" ? "flex" : "hidden") +
            " min-h-0 flex-1 lg:flex"
          }
        >
          <ScannerCard />
        </div>
        <div
          className={
            (state.mobileTab === "codes" ? "flex" : "hidden") +
            " min-h-0 flex-1 lg:flex"
          }
        >
          <CodesCard />
        </div>
      </main>

      {/* Mobile-only bottom tab bar (hidden on lg+) */}
      <MobileTabBar />

      <Footer />

      {/* Floating overlays */}
      <Toast />
      {state.modal === "settings" && <SettingsModal />}
      {state.modal === "about" && <AboutModal />}
      {state.modal === "addCode" && <AddCodeModal />}
    </div>
  );
}
