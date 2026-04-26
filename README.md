# CodeDex Pro · Web

<p align="center">
  <strong>The Professional Pokémon TCG Code Scanner — in your browser.</strong><br>
  Open the URL → grant camera → start scanning. Zero install.
</p>

<p align="center">
  <a href="https://codedex-web.vercel.app"><strong>🌐 codedex-web.vercel.app</strong></a>
   ·
  <a href="https://github.com/NYTEMODEONLY/codedexpro"><strong>💻 Desktop version</strong></a>
   ·
  <a href="https://nytemode.com"><strong>nytemode.com</strong></a>
</p>

---

## What is this?

The web port of **CodeDex Pro**, the Pokémon TCG redemption-code scanner. It's a single-page Next.js app that uses your phone or laptop's camera + a client-side QR detector to scan, organize, and export hundreds of TCG codes — without sending anything to a server.

Use the [native desktop app](https://github.com/NYTEMODEONLY/codedexpro) for marathon scanning sessions on a fixed webcam. Use this web version when you want a shareable link and zero install.

## Features

- Live continuous QR scanning via [`qr-scanner`](https://github.com/nimiq/qr-scanner) (jsQR-backed, ~25 KB)
- Animated cyan reticle + scan-line sweep + green flash on capture
- Pokédex-style numbered list with green/gray dots showing scan source (camera vs manual)
- Code Blocks tab — auto-grouped into 10s with format selector (numbered / raw / space / comma)
- TXT + Markdown export via Blob downloads
- Copy-to-clipboard, Settings, About, Add Code modals
- Keyboard shortcuts — ⌘N / ⌘E / ⌘⇧E / ⌘⇧C / ⌘Z / ⌘,
- Session persistence via `localStorage` — codes survive reload
- 100% local processing — codes never touch a server
- Fully responsive — desktop two-column, mobile bottom-tab; **never scrolls** (single-viewport on every device)
- Dark UI with creature-ball red + electric yellow palette, Space Grotesk + Inter Tight + JetBrains Mono typography

## Stack

- **Next.js 16** (App Router, static-friendly)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (`@theme` design tokens)
- **`qr-scanner`** for live QR detection
- `useReducer` + Context for state, no extra deps
- Deployed on **Vercel** ([nytemode](https://nytemode.com) account)

## Run locally

```bash
git clone https://github.com/NYTEMODEONLY/codedex-web.git
cd codedex-web
npm install
npm run dev
```

Open http://localhost:3000 — Chrome / Safari / Firefox all support `getUserMedia` on `localhost`.

For a production build:

```bash
npm run build
npm run start
```

## Deploy

Connected to Vercel. Manual deploy:

```bash
vercel --prod
```

## Project Structure

```
app/
├── layout.tsx          # html shell, fonts, metadata
├── page.tsx            # entry → AppShell
└── globals.css         # design tokens (@theme), keyframes, base reset

components/
├── AppShell.tsx        # AppProvider + responsive layout
├── Header.tsx          # brand + energy strip + count badge + about/settings
├── Footer.tsx          # version + nytemode credit
├── ScannerCard.tsx     # camera + reticle + status + controls
├── CameraView.tsx      # <video> + reticle overlay + flash
├── StatusIndicator.tsx # off/live/scanning pulse-ring
├── CodesCard.tsx       # tabs + list + actions
├── CodesList.tsx       # scrollable list
├── CodeRow.tsx         # #001 + code + source dot
├── EmptyState.tsx      # Pokéball watermark + hint
├── CodeBlocksTab.tsx   # block selector + format selector + display
├── Toast.tsx           # bottom-anchored auto-dismiss
├── EnergyStrip.tsx     # decorative pip strip
├── MobileTabBar.tsx    # bottom nav (mobile only)
├── Pokeball.tsx        # original CSS-rendered ball mark
├── Toggle.tsx          # custom switch (settings)
├── SectionTitle.tsx    # accent stripe + uppercase title
└── modals/
    ├── Modal.tsx           # base shell with focus trap + Esc close
    ├── SettingsModal.tsx   # 3 group cards
    ├── AboutModal.tsx      # nytemode credits + feature list
    └── AddCodeModal.tsx    # slim modal for manual entry

lib/
├── state.tsx           # AppProvider + useApp hook
├── storage.ts          # localStorage helpers (versioned keys)
├── format.ts           # code formatting + Blob download
├── shortcuts.ts        # global keyboard shortcuts hook
├── scanner.ts          # qr-scanner wrapper + cooldown
└── cn.ts               # classnames helper

types/
└── index.ts            # AppState, Action, Code, Settings, …
```

## Browser support

| Browser              | Min version | Notes                              |
| -------------------- | ----------- | ---------------------------------- |
| iOS Safari           | 15+         | Requires user gesture for camera   |
| Android Chrome       | 100+        | Best detection performance         |
| Desktop Chrome/Edge  | 100+        |                                    |
| Desktop Firefox      | 100+        |                                    |
| Desktop Safari       | 16+         |                                    |

## PRD

Full product spec lives in [`PRD.md`](PRD.md) — vision, functional + non-functional requirements, layout specs (desktop & mobile), state model, success criteria, risks.

## Privacy

100% client-side. The page is a static bundle; the only network request after initial load is for Google Fonts (cached after first paint). Camera frames are decoded in-browser by `qr-scanner`. Codes are stored in `localStorage` under the `codedex.session.v1` key. Nothing ever leaves your device.

## License

MIT — same as the [desktop version](https://github.com/NYTEMODEONLY/codedexpro).

## Acknowledgments

- Pokémon is a trademark of Nintendo, Creatures Inc., and GAME FREAK Inc. This app is unofficial and unaffiliated.
- QR detection by [Nimiq's `qr-scanner`](https://github.com/nimiq/qr-scanner) (jsQR-backed)
- Built by collectors, for collectors

---

<p align="center">
  Made with ❤️ by <a href="https://nytemode.com">NYTEMODE</a>
</p>
