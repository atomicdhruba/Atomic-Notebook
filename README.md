# Atomic Notebook ⚛️⚡

> **The Notepad Windows was supposed to give you.**  
> Engineered with CodeMirror 6, Unified AST pipeline, Idiomorph DOM morphing, Electron runtime, and Antigravity 2.0 visual design tokens.

[![CI](https://github.com/atomicdhruba/Atomic-Notebook/actions/workflows/ci.yml/badge.svg)](https://github.com/atomicdhruba/Atomic-Notebook/actions/workflows/ci.yml)
[![Download Windows .exe](https://img.shields.io/badge/Download-.EXE%20Installer-blue.svg?style=for-the-badge&logo=windows)](https://github.com/atomicdhruba/Atomic-Notebook/releases/download/v0.1.0/Atomic-Notebook-Setup-0.1.0.exe)
[![Open Web App](https://img.shields.io/badge/Launch-Web%20App-purple.svg?style=for-the-badge&logo=googlechrome)](https://atomicdhruba.github.io/Atomic-Notebook/)

---

## 📥 Downloads & Access

| Platform | Format | Status | Download Link |
| :--- | :--- | :--- | :--- |
| **Windows (10 / 11)** | **Executable Installer (.exe)** | **Available** | [**Download Atomic-Notebook-Setup-0.1.0.exe**](https://github.com/atomicdhruba/Atomic-Notebook/releases/download/v0.1.0/Atomic-Notebook-Setup-0.1.0.exe) |
| **Universal Desktop / Web** | **Live Web Application** | **Online** | [**Launch Web App (Zero Install)**](https://atomicdhruba.github.io/Atomic-Notebook/) |

---

## 🌟 Key Highlights

- **Native Windows Desktop Experience:** Packaged with Electron, custom frameless titlebar with native Windows 11 window controls (minimize, maximize, close), and drag regions.
- **CodeMirror 6 Engine:** Low memory footprint, instantaneous startup, fold gutter, bracket auto-closing, active line highlighting, and multi-selection.
- **Antigravity 2.0 Markdown Pipeline:** Unified + Remark + Rehype AST architecture rendering GitHub alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`), KaTeX mathematical notation, and GFM tables.
- **Interactive Code Cards:** Automatic language badge detection with one-click clipboard copying.
- **Live HTML Sandbox with DOM Morphing:** Sandboxed `iframe` previewing live HTML/CSS with `idiomorph` differential DOM updates and an integrated debugging console.
- **Piecewise Linear Scroll Sync:** Bidirectional scroll interpolation matching CodeMirror lines directly to preview DOM elements via source-map line attributes.
- **Zero-AI-Slop Architecture:** Strict TypeScript (`strict`, `noUnusedLocals`, `noImplicitReturns`), no file exceeding 220 LOC, zero magic values, and central diagnostic logging.

---

## 🚀 Desktop & Developer Commands

### Launching the Desktop App in Development

```bash
# Start frontend and electron shell
npm run dev
```

### Compiling Executables for Desktop Devices

```bash
# Compile Windows .exe installer and portable executable
npm run electron:build

# Multi-platform build for Windows, macOS, and Linux
npm run electron:build:all
```

The compiled binaries will be output into the `release-dist/` folder:
- `release-dist/Atomic-Notebook-Setup-0.1.0.exe` (Windows NSIS Setup)
- `release-dist/win-unpacked/Atomic Notebook.exe` (Standalone Portable Exe)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>T</kbd> | Open New Tab |
| <kbd>Ctrl</kbd> + <kbd>W</kbd> | Close Current Tab |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | Save Document |
| <kbd>Ctrl</kbd> + <kbd>O</kbd> | Open File Dialog |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | Search in Document |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Indent / Unindent selection |

---

## 🏗️ Architecture

```text
atomic-notebook/
├── electron/
│   ├── main.cjs               # Native window setup, IPC bridges, and single-instance lock
│   └── preload.cjs            # Secure contextBridge API for file I/O and window controls
├── .github/workflows/
│   ├── ci.yml                 # Automated typecheck and build validation
│   └── release.yml            # Cross-platform matrix builder for Windows, macOS, and Linux
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
│       ├── TitleBar/          # Windows custom titlebar with native window buttons
│       ├── Workspace/         # Draggable split-pane container
│       ├── PreviewPane/       # Live Markdown & HTML sandbox panes
│       └── StatusBar/         # Live metrics, line endings, encodings, and position
```

---

## 📄 License

MIT © Atomic Notebook Contributors
