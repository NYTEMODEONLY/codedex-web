"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type {
  Action,
  AppState,
  Code,
  ModalKind,
  Settings,
  ToastPayload,
  MobileTab,
} from "@/types";
import {
  DEFAULT_SETTINGS,
  loadCodes,
  loadSettings,
  saveCodes,
  saveSettings,
} from "./storage";
import { bumpTally } from "./useTally";

const MAX_UNDO = 20;

const initial: AppState = {
  codes: [],
  settings: DEFAULT_SETTINGS,
  cameraOn: false,
  scanning: false,
  toast: null,
  modal: null,
  mobileTab: "scanner",
  undoStack: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, codes: action.codes, settings: action.settings };
    case "ADD_CODE": {
      if (state.codes.some((c) => c.value === action.code.value)) return state;
      return {
        ...state,
        codes: [...state.codes, action.code],
        undoStack: pushUndo(state.undoStack, state.codes),
      };
    }
    case "ADD_CODES": {
      const existing = new Set(state.codes.map((c) => c.value));
      const fresh = action.codes.filter((c) => !existing.has(c.value));
      if (fresh.length === 0) return state;
      return {
        ...state,
        codes: [...state.codes, ...fresh],
        undoStack: pushUndo(state.undoStack, state.codes),
      };
    }
    case "CLEAR":
      if (state.codes.length === 0) return state;
      return {
        ...state,
        codes: [],
        undoStack: pushUndo(state.undoStack, state.codes),
      };
    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const stack = [...state.undoStack];
      const prev = stack.pop()!;
      return { ...state, codes: prev, undoStack: stack };
    }
    case "SET_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    case "OPEN_MODAL":
      return { ...state, modal: action.modal };
    case "CLOSE_MODAL":
      return { ...state, modal: null };
    case "SET_CAMERA_ON":
      return { ...state, cameraOn: action.on, scanning: action.on ? state.scanning : false };
    case "SET_SCANNING":
      return { ...state, scanning: action.scanning };
    case "SHOW_TOAST":
      return { ...state, toast: action.payload };
    case "HIDE_TOAST":
      return { ...state, toast: null };
    case "SET_MOBILE_TAB":
      return { ...state, mobileTab: action.tab };
    default:
      return state;
  }
}

function pushUndo(stack: Code[][], snapshot: Code[]): Code[][] {
  const next = [...stack, snapshot];
  while (next.length > MAX_UNDO) next.shift();
  return next;
}

interface ContextShape {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  showToast: (msg: string, opts?: Partial<ToastPayload>) => void;
  addCode: (value: string, source: "scan" | "manual") => boolean;
  openModal: (modal: NonNullable<ModalKind>) => void;
  closeModal: () => void;
  setMobileTab: (tab: MobileTab) => void;
  setSettings: (patch: Partial<Settings>) => void;
}

const AppContext = createContext<ContextShape | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const toastTimer = useRef<number | null>(null);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    dispatch({
      type: "HYDRATE",
      codes: loadCodes(),
      settings: loadSettings(),
    });
  }, []);

  // Persist codes whenever they change
  useEffect(() => {
    saveCodes(state.codes);
  }, [state.codes]);

  // Persist settings whenever they change
  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  const showToast = useCallback(
    (message: string, opts?: Partial<ToastPayload>) => {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message, success: true, ...opts },
      });
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => {
        dispatch({ type: "HIDE_TOAST" });
      }, 2200);
    },
    []
  );

  const addCode = useCallback(
    (value: string, source: "scan" | "manual"): boolean => {
      const v = value.trim().toUpperCase();
      if (!v) return false;
      const isDup = state.codes.some((c) => c.value === v);
      if (isDup) {
        // Silent for scan source (cooldown will retry); explicit for manual
        if (source === "manual") {
          showToast("Already captured", { code: v, success: false });
        }
        return false;
      }
      dispatch({
        type: "ADD_CODE",
        code: { value: v, source, capturedAt: Date.now() },
      });
      // Fire-and-forget global counter increment. Failures are silent —
      // the counter is best-effort and undercount is acceptable.
      bumpTally();
      const verb = source === "scan" ? "Captured" : "Added";
      showToast(verb, { code: v });
      return true;
    },
    [state.codes, showToast]
  );

  const openModal = useCallback(
    (modal: NonNullable<ModalKind>) => dispatch({ type: "OPEN_MODAL", modal }),
    []
  );
  const closeModal = useCallback(() => dispatch({ type: "CLOSE_MODAL" }), []);
  const setMobileTab = useCallback(
    (tab: MobileTab) => dispatch({ type: "SET_MOBILE_TAB", tab }),
    []
  );
  const setSettings = useCallback(
    (patch: Partial<Settings>) =>
      dispatch({ type: "SET_SETTINGS", settings: patch }),
    []
  );

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        showToast,
        addCode,
        openModal,
        closeModal,
        setMobileTab,
        setSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): ContextShape {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
