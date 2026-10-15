# NotchPad 📝⚡

> **Next-Gen Windows Notepad with Live Markdown & HTML Engine**  
> Engineered with CodeMirror 6, Unified AST pipeline, Idiomorph DOM morphing, and Antigravity 2.0 visual design tokens.

[![CI](https://github.com/atomic/notchpad/actions/workflows/ci.yml/badge.svg)](https://github.com/atomic/notchpad/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%20Strict-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Key Highlights

- **CodeMirror 6 Core:** Low memory footprint, instantaneous startup, fold gutter, bracket auto-closing, active line highlighting, and multi-selection.
- **Antigravity 2.0 Markdown Pipeline:** Unified + Remark + Rehype AST architecture rendering GitHub alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`), KaTeX mathematical notation, and GFM tables.
- **Interactive Code Cards:** Automatic language badge detection with one-click clipboard copying.
- **Live HTML Sandbox with DOM Morphing:** Sandboxed `iframe` previewing live HTML/CSS with `idiomorph` differential DOM updates and an integrated debugging console.
- **Piecewise Linear Scroll Sync:** Bidirectional scroll interpolation matching CodeMirror lines directly to preview DOM elements via source-map line attributes.
- **Zero-AI-Slop Architecture:** Strict TypeScript (`strict`, `noUnusedLocals`, `noImplicitReturns`), no file exceeding 220 LOC, zero magic values, and central diagnostic logging.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ or v22+
- `npm` 10+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/your-username/notchpad.git
cd notchpad

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Typecheck

```bash
# Verify TypeScript strict types
npm run typecheck

# Build optimized production bundle
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>T</kbd> | Open New Tab |
| <kbd>Ctrl</kbd> + <kbd>W</kbd> | Close Current Tab |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | Save Document |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | Search in Document |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Indent / Unindent selection |

---

## 🏗️ Architecture

```text
notchpad/
├── .github/workflows/         # CI/CD typechecking and automated Windows releases
├── src/
│   ├── config/constants.ts    # Debounce timings, shortcuts, and IPC tokens
│   ├── utils/logger.ts        # Central diagnostic logger
│   ├── styles/
│   │   ├── tokens.css         # Windows 11 acrylic / Antigravity design variables
│   │   └── markdown-theme.css # Callouts, tables, cards, and typography
│   ├── store/
│   │   └── tabStore.ts        # Multi-tab state, dirty tracking, line endings
│   ├── core/
│   │   ├── editor/            # CodeMirror 6 setup, compartments, and themes
│   │   ├── markdown/          # Unified pipeline, callout plugin, rehype source map
│   │   ├── html-sandbox/      # Sandbox host, idiomorph DOM morphing, console bridge
│   │   └── sync/              # Piecewise linear bidirectional scroll synchronizer
│   └── components/
│       ├── TitleBar/          # Windows custom titlebar and tab strip
│       ├── Workspace/         # Draggable split-pane container
│       ├── PreviewPane/       # Live Markdown & HTML sandbox panes
│       └── StatusBar/         # Live metrics, line endings, encodings, and position
```

---

## 📄 License

MIT © NotchPad Contributors
