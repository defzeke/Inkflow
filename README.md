# Inkflow Studio

A fast, elegant split-pane markdown editor with live preview, dual render modes, and shareable links — all in the browser, no backend required.

---

## What is it?

Inkflow Studio is a web-based writing environment where you type Markdown on the left and watch it render beautifully on the right — in real time. When your writing is ready, hit **Publish** to generate a compressed, shareable link that anyone can open to read a clean, read-only version of your content.

---

## Features

### Writing Experience
- **Split-pane editor** — distraction-free textarea on the left, live preview on the right
- **Two render modes** — switch between **Markdown** (via `react-markdown` + GFM) and **HTML** (sanitized via DOMPurify)
- **Sync scroll** — optionally link the scroll positions of both panes so they move together
- **Character limit** — 10,000 character cap with a visual usage bar in the footer that shifts color as you approach the limit

### Appearance
- **Dark / Light mode** — detects your system preference on first load, with a manual toggle in the toolbar

### Sharing
- **Publish modal** — choose your format (Markdown or HTML), add an optional publisher name, and copy a shareable link
- **Compressed URLs** — content is compressed with `lz-string` before being embedded in the URL, keeping links as short as possible
- **30-day expiry** — every link carries an expiry timestamp; expired links show a friendly notice instead of the content
- **Live countdown** — the share page displays exactly how long the link has left before it expires

### Mobile
- **Burger menu** — toolbar controls collapse into a clean dropdown on small screens
- **Tab bar** — switch between the Editor and Preview panes with a tap; only one pane is shown at a time on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + React Compiler |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Markdown rendering | `react-markdown` + `remark-gfm` |
| HTML sanitization | `dompurify` |
| URL compression | `lz-string` |
| Language | TypeScript 5 |

---

## Project Structure

```
app/
  page.tsx                    # Entry point — renders <MarkdownEditor />
  share/page.tsx              # Share page — async server component

features/markdown-editor/
  MarkdownEditor.tsx          # Root client component, owns all state
  Toolbar.tsx                 # App bar with all controls
  EditorPane.tsx              # Textarea + character usage footer
  PreviewPane.tsx             # Live rendered preview + stats footer
  SharePreview.tsx            # Read-only share page renderer
  constants.ts                # APP_NAME, MAX_EDITOR_CHARS, renderers
  components/
    PublishModal.tsx           # Publish flow — format picker, link copy
    ExpiryCountdown.tsx        # Countdown timer on share page
    PaneHeader.tsx             # Labeled header bar for each pane
    PaneFooter.tsx             # Stats + usage indicator
    SunIcon.tsx / MoonIcon.tsx
    HamburgerIcon.tsx / XIcon.tsx

libs/
  share.ts                    # URL encode/decode, expiry logic, link builder
  time.ts                     # formatCountdown helper
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
npm run build   # production build
npm run lint    # lint with ESLint
```

---

## How Sharing Works

When you click **Publish**, the editor:

1. Compresses your content with `lz-string`
2. Embeds it in a URL along with format, publisher name, and a 30-day expiry timestamp
3. Copies the link to your clipboard

Anyone who opens the link lands on `/share`, where a Next.js server component decodes the URL, checks the expiry, and renders a clean read-only view of your content — no account, no database, no server state. 