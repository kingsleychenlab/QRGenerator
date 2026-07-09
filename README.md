# QRGenerator

A fast, polished QR code generator. Type any text or URL and get a scannable QR
code you can style, download, and copy — no accounts, no backend, no tracking.

Styled as a dark instrument console: a live viewfinder frames the code with a
scanner reticle, and a monospace readout reports the encoder status as you type.

<p align="center">
  <img src="docs/screenshot-desktop.png" alt="QRGenerator on desktop" width="720">
</p>

## Features

- **Live preview** — the code re-renders the moment you type.
- **Download as PNG** — one click saves a crisp image.
- **Copy to clipboard** — copy the image directly (where the browser supports it).
- **Customize** — size (120–480px), foreground color, background color, and error
  correction level (Low / Medium / Quartile / High).
- **Input validation** — actions stay disabled until there's something to encode.
- **Reset** — return everything to defaults in one click.
- **Responsive** — side-by-side on desktop, stacked on mobile.
- **Accessible** — keyboard-friendly, visible focus, and reduced-motion support.

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | [React](https://react.dev/) + [Vite](https://vite.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | Plain CSS · Space Grotesk + Space Mono |
| QR engine | [`qrcode.react`](https://github.com/zpao/qrcode.react) |

No backend, no paid APIs.

## Getting started

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install    # install dependencies
npm run dev    # start the dev server
```

Then open the URL Vite prints (usually http://localhost:5173).

| Script | Does |
| ------ | ---- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |

## Project structure

```
src/
  main.tsx                 # React entry point
  App.tsx                  # Shell: topbar, tagline, footer
  components/
    QRGenerator.tsx        # Controls, live preview, and actions
  styles/
    index.css              # All styling
```

## Keeping codes scannable

- Rendering uses `qrcode.react`, a mature implementation of the QR spec.
- A quiet-zone margin is kept around the code so scanners can lock onto it.
- Raising the error correction level adds redundancy — useful for small prints or
  custom colors. Keep strong contrast between foreground and background.

## Screenshots

| Desktop | Mobile |
| ------- | ------ |
| <img src="docs/screenshot-desktop.png" alt="Desktop view" width="380"> | <img src="docs/screenshot-mobile.png" alt="Mobile view" width="200"> |

## License

MIT — free to use and modify.

---

<p align="center"><sub>QRGenerator by Kingsley Chen</sub></p>
