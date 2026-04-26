# CodeDex Pro Web — Product Requirements Document

**Version:** 1.0  ·  **Date:** 2026-04-26  ·  **Owner:** nytemode

A web-port of CodeDex Pro, the Pokémon TCG redemption-code scanner.
Single page, fully responsive, no scrolling, deployed on Vercel under
the nytemode account.

---

## 1 · Vision

> **Open the URL → grant camera → start scanning.**
> Zero install, works on phone or desktop, codes never leave the device.

The desktop PyQt5 app stays as the "pro tool" for power users batching
hundreds of cards on a fixed webcam. The web app is the **shareable**
version: a link anyone with a phone or laptop can use immediately.

The web app uses the same visual identity as the desktop redesign —
creature-ball red + electric yellow on deep ink, Pokéball mark, energy
accents, JetBrains Mono codes — but adapts the layout for any viewport.

---

## 2 · Users & Use Cases

| User                    | Use case                                                         | Device   |
| ----------------------- | ---------------------------------------------------------------- | -------- |
| Casual collector        | Scans 5–20 codes on the couch with their phone                   | Mobile   |
| Power collector         | Already uses the desktop app; checks the web app on the go       | Both     |
| First-time visitor      | Lands from nytemode.com or a shared link, wants to try it        | Both     |
| Friend of a collector   | Asked to scan a code they were given; one-shot use               | Mobile   |

---

## 3 · Goals

1. **Frictionless entry** — page loads in <2s, camera prompt within one tap.
2. **No scrolling, ever** — the entire app fits in 100vh / 100dvh on every
   target device. Internal scroll regions (the codes list) are bounded.
3. **Cross-device parity** — the same features work on iPhone Safari,
   Android Chrome, desktop Chrome/Safari/Firefox/Edge.
4. **Privacy preserved** — all QR detection happens client-side. No code
   is ever sent to a server. No analytics that can fingerprint codes.
5. **Shareable URL** — `codedex.nytemode.com` (or Vercel preview URL)
   works as a copy-pasteable link.

### Non-goals (v1)

- Account login / cloud sync
- Multi-device session sharing
- Server-side QR processing
- Native iOS / Android apps (PWA install only)
- Sound effects (deferred — desktop app already has the toggle)
- Light mode (desktop redesign deferred this; web inherits dark-only)

---

## 4 · Functional Requirements

### 4.1 · Capture flow

- **FR-CAP-1** — Tapping `Start Camera` triggers `getUserMedia()` for
  the rear camera (mobile) or default camera (desktop).
- **FR-CAP-2** — A live video feed renders inside a 16:9 viewfinder.
- **FR-CAP-3** — A continuous QR-detection loop runs on every captured
  frame at ~10–15 fps via `qr-scanner` (jsQR-backed).
- **FR-CAP-4** — When a code is detected:
  - The viewport flashes green for ~250 ms.
  - A toast appears: `✓ Captured · ABCD-1234-EFGH-5678`.
  - The code is appended to the in-memory list and persisted.
  - A cooldown (configurable, default 1.5s) prevents the same code
    from re-firing.
- **FR-CAP-5** — Already-captured codes are silently ignored (no toast,
  no flash).
- **FR-CAP-6** — `Scan Now` button forces a one-shot detection on the
  current frame regardless of cooldown.
- **FR-CAP-7** — Camera permission denial shows a clear inline error
  with re-try instructions; the rest of the app remains usable
  (manual entry still works).

### 4.2 · Manual entry

- **FR-MAN-1** — `Add Code` opens a slim modal with a monospace input.
- **FR-MAN-2** — Submitting via Enter or button adds the code with
  `source: "manual"`.
- **FR-MAN-3** — Empty input is ignored. Whitespace trimmed.

### 4.3 · Codes view

- **FR-LIST-1** — All captured codes show in a list, newest at the bottom.
- **FR-LIST-2** — Each row shows: `#001` index, the code, a colored dot
  indicating source (green = scan, gray = manual). Hover shows the
  source as tooltip; tap on mobile shows nothing extra (color is the
  primary signal).
- **FR-LIST-3** — Empty state shows a Pokéball watermark + "No codes
  captured yet" + hint.
- **FR-LIST-4** — Scrolling is allowed *inside* the list panel only.
- **FR-LIST-5** — A second tab "Code Blocks" shows codes grouped into
  blocks of 10 with a block selector + format selector
  (Numbered / Raw / Space-Separated / Comma-Separated) and a
  read-only display of the formatted text.

### 4.4 · Export & copy

- **FR-EXP-1** — `Copy All` copies all codes (newline-joined) to the
  clipboard via `navigator.clipboard.writeText`.
- **FR-EXP-2** — `Copy Block` copies the current block in the selected
  format.
- **FR-EXP-3** — `Export TXT` triggers a Blob download of
  `pokemon_tcg_codes.txt` (one code per line).
- **FR-EXP-4** — `Export MD` triggers a Blob download of
  `pokemon_tcg_codes.md` with a header, count, and the codes formatted
  per the format selector.
- **FR-EXP-5** — Empty state: copy/export buttons are disabled and a
  toast says `Nothing to copy/export yet`.

### 4.5 · Settings

- **FR-SET-1** — `Settings` modal with three groups: Camera, Scan
  Behavior, Capture & Sound.
- **FR-SET-2** — Settings:
  - Camera device (dropdown of `enumerateDevices()` video inputs).
  - Auto-detect on/off (toggle).
  - Scan interval (numeric, ms).
  - Cooldown after scan (numeric, sec).
  - Success flash on/off (toggle).
  - Sound effects on/off (toggle, deferred — UI present, no audio).
- **FR-SET-3** — Settings persist to `localStorage` and survive reload.

### 4.6 · About

- **FR-ABOUT-1** — `About` modal with Pokéball hero, version line,
  description, feature list, and a `nytemode` credit linking to
  https://nytemode.com.

### 4.7 · Footer credit

- **FR-FOOT-1** — Footer always visible; shows
  `v1.4.2 · ● Local processing only` on the left and
  `About · Docs · ☾ a nytemode project` on the right.
  `nytemode` and `Docs` link to https://nytemode.com.

### 4.8 · Persistence

- **FR-PER-1** — Codes + sources persist to `localStorage` under
  the key `codedex.session.v1`.
- **FR-PER-2** — Settings persist to `codedex.settings.v1`.
- **FR-PER-3** — `Clear` empties the list and shows a toast with
  `Cleared all codes — ⌘Z to undo`.
- **FR-PER-4** — `⌘Z` / `Ctrl+Z` undoes the last destructive action
  (clear, dedupe). Stack depth 20.

### 4.9 · Keyboard shortcuts (desktop)

- `Space` → Scan now
- `⌘+N` / `Ctrl+N` → Add code manually
- `⌘+,` / `Ctrl+,` → Settings
- `⌘+E` / `Ctrl+E` → Export TXT
- `⌘+Shift+E` / `Ctrl+Shift+E` → Export MD
- `⌘+Shift+C` / `Ctrl+Shift+C` → Copy all
- `⌘+Z` / `Ctrl+Z` → Undo

---

## 5 · Non-functional Requirements

### 5.1 · Layout: no scrolling

The single hard rule. The page is **`100dvh`** (dynamic viewport height
to handle iOS Safari URL bar). Internal scroll regions are explicitly
bounded with `overflow-y: auto`.

### 5.2 · Responsive breakpoints

| Breakpoint  | Width        | Layout                                  |
| ----------- | ------------ | --------------------------------------- |
| Mobile      | < 768px      | Single column, bottom tab nav           |
| Tablet      | 768–1023px   | Single column, slimmer cards            |
| Desktop     | ≥ 1024px     | Two-column (scanner / codes side by side) |

#### Desktop layout (≥ 1024px)

```
┌────────────────────────────────────────────────────────┐
│ Header (brand + count + about + settings)              │
├──────────────────────┬─────────────────────────────────┤
│                      │                                 │
│  Scanner card        │  Codes card                     │
│  ├ status indicator  │  ├ tabs (All Codes / Blocks)    │
│  ├ camera viewport   │  ├ list with scroll-internal    │
│  ├ tip strip         │  └ action row                   │
│  └ start / scan buttons                                │
│                      │                                 │
├──────────────────────┴─────────────────────────────────┤
│ Footer                                                 │
└────────────────────────────────────────────────────────┘
```

#### Mobile layout (< 768px)

```
┌──────────────────────────────┐
│ Header (compact)             │
├──────────────────────────────┤
│                              │
│   Active tab content:        │
│   - Scanner: full viewport   │
│   - Codes:   list + actions  │
│                              │
├──────────────────────────────┤
│ Bottom tab bar:              │
│ [📷 Scanner] [📋 Codes (5)]  │
├──────────────────────────────┤
│ Footer (compact, single line)│
└──────────────────────────────┘
```

The bottom tab bar lets the user toggle between Scanner and Codes
without scrolling. A count badge on the Codes tab shows `(N)`.

### 5.3 · Performance

- **First Contentful Paint** < 1.5s on 4G mobile
- **Time to Interactive** < 2.5s on 4G mobile
- **Bundle size** < 250 KB gzipped initial JS
- **QR detection** sustained 10+ fps on a 2018-era iPhone

### 5.4 · Privacy

- No third-party analytics.
- No external API calls during normal operation.
- No service worker logging beyond standard PWA caching.
- README + About modal both state "100% local processing".

### 5.5 · Accessibility

- All interactive elements have keyboard focus + visible focus rings.
- Color is never the only signal (dot + tooltip + screen-reader label).
- Modals trap focus and close on Esc.
- Camera permission failure is announced via `aria-live="polite"`.

### 5.6 · Browser support

| Browser              | Min version | Notes                              |
| -------------------- | ----------- | ---------------------------------- |
| iOS Safari           | 15+         | Requires user gesture for camera   |
| Android Chrome       | 100+        | Best detection performance         |
| Desktop Chrome/Edge  | 100+        |                                    |
| Desktop Firefox      | 100+        |                                    |
| Desktop Safari       | 16+         |                                    |

---

## 6 · Tech Stack

| Layer            | Choice                               | Why                                |
| ---------------- | ------------------------------------ | ---------------------------------- |
| Framework        | **Next.js 16** (App Router)          | Vercel-native, modern React 19     |
| Language         | **TypeScript** (strict)              | Type safety; matches CLAUDE.md     |
| Styling          | **Tailwind CSS v4**                  | Fast iteration, design tokens      |
| Fonts            | `next/font/google` — Space Grotesk, Inter Tight, JetBrains Mono | Match design package |
| QR scanning      | **`qr-scanner`** (Nimiq, jsQR-based) | ~25 KB, continuous scan helper     |
| State            | React `useReducer` + `useContext`    | No extra dep                       |
| Persistence      | `localStorage` w/ versioned keys     | No deps, instant                   |
| Linting          | ESLint + Next.js defaults            | Standard                           |
| Deploy           | Vercel (nytemode account)            | User's existing account            |

### Why Next.js even though it's mostly client-side?

- Built-in route handlers for any future server work (none planned for v1)
- `next/font` for optimal Google Fonts loading
- Vercel deploys it with zero config
- Can use static export if we want to host elsewhere later

---

## 7 · Component Tree

```
app/
  layout.tsx              — html shell, fonts, metadata
  page.tsx                — main app entry (client component)
  globals.css             — design tokens via CSS custom properties

components/
  Header.tsx              — brand + energy strip + count + about/settings
  Footer.tsx              — version + nytemode credit
  ScannerCard.tsx         — wraps CameraView + status + controls
  CameraView.tsx          — <video> + reticle overlay + scan-line + flash
  CodesCard.tsx           — wraps tabs + list + actions
  CodesList.tsx           — virtualized list of CodeRow
  CodeRow.tsx             — #001 + code + source dot
  EmptyState.tsx          — Pokéball watermark + title + hint
  CodeBlocksTab.tsx       — block selector + format selector + display
  Toast.tsx               — bottom-anchored, auto-dismiss
  StatusIndicator.tsx     — pulse-ring + Off/Live/Scanning label
  EnergyStrip.tsx         — decorative pip strip in header
  Pokeball.tsx            — CSS / SVG mark
  MobileTabBar.tsx        — bottom nav for mobile (Scanner | Codes)

modals/
  Modal.tsx               — base shell (focus trap, Esc, click-outside)
  SettingsModal.tsx
  AboutModal.tsx
  AddCodeModal.tsx

lib/
  scanner.ts              — qr-scanner wrapper + lifecycle
  storage.ts              — localStorage helpers, versioned keys
  format.ts               — code formatting (numbered/raw/space/comma)
  shortcuts.ts            — keyboard binding hook
  state.ts                — reducer + context for codes/settings/undo
  toast.ts                — toast queue + show()
  cn.ts                   — classnames helper

types/
  index.ts                — Code, Source, Settings, etc.
```

---

## 8 · State Model

```ts
type Source = "scan" | "manual";

interface Code {
  value: string;        // "ABCD-1234-EFGH-5678"
  source: Source;
  capturedAt: number;   // epoch ms
}

interface Settings {
  cameraId: string | null;     // device id from enumerateDevices
  autoDetect: boolean;         // default true
  scanIntervalMs: number;      // default 250
  cooldownSec: number;         // default 1.5
  flash: boolean;              // default true
  sound: boolean;              // default false (deferred)
}

interface AppState {
  codes: Code[];
  settings: Settings;
  cameraOn: boolean;
  scanning: boolean;
  toast: { message: string; code?: string; success?: boolean } | null;
  modal: "settings" | "about" | "addCode" | null;
  mobileTab: "scanner" | "codes";
  undoStack: Code[][];        // snapshots for ⌘Z (max 20)
}
```

Actions: `ADD_CODE`, `REMOVE_CODE`, `CLEAR`, `UNDO`, `SET_SETTINGS`,
`OPEN_MODAL`, `CLOSE_MODAL`, `SET_CAMERA`, `SET_SCANNING`, `SHOW_TOAST`,
`HIDE_TOAST`, `SWITCH_TAB`.

---

## 9 · Camera & QR Pipeline

```
Start Camera
  ↓
getUserMedia({ video: { facingMode: "environment" } })
  ↓
attach stream to <video> element
  ↓
QrScanner.start() — runs detection on each animation frame
  ↓
on detect → check cooldown → check dedupe → ADD_CODE → flash + toast
```

`qr-scanner` handles its own throttling and worker offloading
internally, so we don't need to manage frame timing manually beyond
the per-code cooldown.

Camera permission states:

| State       | UI                                                        |
| ----------- | --------------------------------------------------------- |
| Not asked   | `Start Camera` button is the affordance                   |
| Asking      | Spinner, "Requesting camera permission…"                  |
| Granted     | Live feed with reticle                                    |
| Denied      | Inline error in viewport: "Camera access denied. Tap to retry" |
| Unavailable | "No camera detected on this device. Use Add Code instead." |

---

## 10 · Visual Spec

Inherits the desktop redesign tokens verbatim (see
`pokescanbot/src/theme.py` `PALETTE`). Tailwind config exposes them as
utility classes (e.g. `bg-surface`, `text-yellow`, `border-border`).

Key tokens:

```
--c-bg          #0B0D14
--c-surface     #161823
--c-surface-2   #1C1F2D
--c-border      #262A3B
--c-text        #F1F2F7
--c-text-muted  #6E7287
--c-red         #E63946
--c-yellow      #FFCB05
--c-success     #34C759
--c-scan        #5AC8FA
```

Fonts:
- `Space Grotesk` — display (header brand, modal titles, section titles)
- `Inter Tight` — body (paragraphs, hints, button labels)
- `JetBrains Mono` — codes, badges, all-caps tags, numbers

---

## 11 · Success Criteria

- [ ] Page loads with no scrollbars at any viewport ≥ 360×600.
- [ ] Camera starts and detects QR codes on iPhone 12+ Safari and
      Pixel 4+ Chrome.
- [ ] Capturing 100 codes in a row stays smooth (no jank, no memory
      growth).
- [ ] All buttons are reachable by keyboard with visible focus.
- [ ] Modals close on Esc and outside-click.
- [ ] localStorage round-trip works: codes + settings persist across
      reload.
- [ ] Footer "nytemode" link opens https://nytemode.com.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices
      ≥ 95.

---

## 12 · Implementation Phases

### Phase 1 — Scaffold (30 min)
- `npx create-next-app@latest` (TS, App Router, Tailwind, no src dir)
- Install `qr-scanner`
- Configure Tailwind tokens to match design palette
- Wire `next/font` for the three Google Fonts
- Verify `npm run dev` renders a Hello-World

### Phase 2 — Layout shell (45 min)
- App container with `100dvh` height
- Desktop two-column grid (CSS Grid, `grid-cols-[5fr_6fr]`)
- Mobile single-column with bottom tab bar
- Responsive breakpoint at `lg:` (1024 px)
- Header + Footer placeholders

### Phase 3 — Components (parallel, agent-assisted, 2 hr)
Three independent slices, each ownable by a separate agent:
- **Slice A — Scanner:** CameraView, ScannerCard, StatusIndicator,
  qr-scanner integration
- **Slice B — Codes:** CodesCard, CodesList, CodeRow, EmptyState,
  CodeBlocksTab, format helpers
- **Slice C — Modals + chrome:** Modal base, SettingsModal,
  AboutModal, AddCodeModal, Toast, Header, Footer

### Phase 4 — State + persistence (45 min)
- `useReducer` + Context, actions wired
- localStorage hooks (`useLocalStorage<T>`)
- Undo stack
- Keyboard shortcuts hook

### Phase 5 — Mobile polish (30 min)
- Bottom tab nav
- Camera viewport sizing on mobile (account for URL bar via 100dvh)
- Touch target audit (≥ 44×44 px)

### Phase 6 — Deploy (15 min)
- `vercel link` to a new project under the nytemode account
- `vercel --prod` for first deploy
- Verify URL works on phone + desktop
- Verify HTTPS camera flow works on iPhone

---

## 13 · Out of Scope (v1)

- User accounts, login, cloud sync
- Server-side QR detection
- Native iOS / Android apps
- Sound effects (UI present, audio deferred)
- Light mode
- Internationalization
- Code redemption (beyond exporting / copying — actual redemption
  requires Pokémon TCG Online's flow)
- Set / expansion detection from code prefix
- Multi-language code formats

---

## 14 · Risks

| Risk                                                | Mitigation                                                |
| --------------------------------------------------- | --------------------------------------------------------- |
| iOS Safari camera permission UX                     | Clear inline guidance + retry CTA                         |
| Bundle size from Next.js                            | Static export possible; `qr-scanner` is small             |
| QR detection accuracy on phone in low light         | Use `qr-scanner`'s built-in highlight options; show tip   |
| iOS Safari URL bar collapse changing viewport       | Use `100dvh` not `100vh`                                  |
| User tries to scroll out of habit                   | Acceptable — there's nothing to scroll *to*; not a bug    |
| Vercel free-tier cold starts                        | App is mostly static — no functions needed for v1         |

---

*This PRD is the contract for the v1 build. Changes to scope or
non-functional requirements should update this document first.*
