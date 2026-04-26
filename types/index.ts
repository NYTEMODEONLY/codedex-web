export type Source = "scan" | "manual";

export interface Code {
  value: string;
  source: Source;
  capturedAt: number; // epoch ms
}

export interface Settings {
  cameraId: string | null;
  autoDetect: boolean;
  scanIntervalMs: number;
  cooldownSec: number;
  flash: boolean;
  sound: boolean;
}

export type ModalKind = "settings" | "about" | "addCode" | null;
export type MobileTab = "scanner" | "codes";

export interface ToastPayload {
  message: string;
  code?: string;
  success?: boolean;
}

export interface AppState {
  codes: Code[];
  settings: Settings;
  cameraOn: boolean;
  scanning: boolean;
  toast: ToastPayload | null;
  modal: ModalKind;
  mobileTab: MobileTab;
  undoStack: Code[][];
}

export type Action =
  | { type: "ADD_CODE"; code: Code }
  | { type: "ADD_CODES"; codes: Code[] }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "SET_SETTINGS"; settings: Partial<Settings> }
  | { type: "OPEN_MODAL"; modal: NonNullable<ModalKind> }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_CAMERA_ON"; on: boolean }
  | { type: "SET_SCANNING"; scanning: boolean }
  | { type: "SHOW_TOAST"; payload: ToastPayload }
  | { type: "HIDE_TOAST" }
  | { type: "SET_MOBILE_TAB"; tab: MobileTab }
  | { type: "HYDRATE"; codes: Code[]; settings: Settings };
