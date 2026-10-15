# Project Specification: NotchPad (Next-Gen Windows Notepad with Live MD & HTML Engine)

## 1. Role & Strict Code Quality Guardrails (MANDATORY)
Act as a Principal Desktop Systems Architect. Every file you generate for this repository will be published as a flagship open-source project on GitHub and must pass strict human code review.

### Anti-AI-Slop Rules:
1. **Comment Discipline:** NEVER write explanatory comments stating *what* the code does (e.g., `// Initialize editor`, `// Update preview state`). Only write comments explaining *why* a non-obvious edge case, security boundary, or algorithmic optimization exists.
2. **Strict Modularity:** No source file may exceed 220 lines of code. Separate IPC bridges, state stores, AST plugins, and UI components into dedicated modules.
3. **Zero Placeholders:** Never output `// TODO: implement later` or truncated logic. Implement complete error handling, edge-case guards, and cleanup disposers (`AbortController`, event listener teardown).
4. **No Console Spam:** Do not leave `console.log` statements in application logic. Route runtime diagnostics through a central `src/utils/logger.ts` utility.
5. **No Hardcoded Magic Values:** Extract debounce timings, keybindings, theme tokens, and IPC channel names into `src/config/constants.ts`.
6. **Type Strictness:** Enable `"strict": true`, `"noUnusedLocals": true`, and `"noImplicitReturns": true` in `tsconfig.json`. Never use `any`.

---

## 2. Tech Stack & Core Architecture

* **Desktop Runtime:** Tauri v2 (Rust backend using Windows WebView2) OR Electron + `electron-vite` (if building without Rust).
* **Frontend Core:** TypeScript 5.x + React 19 (or Preact Signals for zero-overhead state) + Vite.
* **Text Editor Engine:** CodeMirror 6 (`@codemirror/state`, `@codemirror/view`, `@codemirror/lang-markdown`, `@codemirror/lang-html`). Chosen over Monaco for instant startup, low memory footprint, and native line-wrapping performance.
* **Markdown Pipeline (Antigravity 2.0 Spec):**
  * `unified` + `remark-parse` + `remark-gfm` (tables, task lists, strikethrough) + `remark-math`.
  * `remark-rehype` + `rehype-katex` (LaTeX math) + `rehype-sanitize`.
  * `shiki` (via `@shikijs/rehype`) for studio-grade syntax highlighting with dual dark/light theme variables.
  * `mermaid` for flowcharts and sequence diagrams.
* **HTML Live Engine:**
  * Sandboxed `<iframe sandbox="allow-scripts">` isolated from the host IPC bridge.
  * `idiomorph` (DOM morphing algorithm) injected into the preview frame so typing HTML/CSS mutates only changed DOM nodes without reloading the iframe or losing scroll position.

---

## 3. Directory Structure

```text
notchpad/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, typecheck, and unit tests
│       └── release.yml            # Automated Windows .msi / .exe build
├── src-tauri/                     # Native OS shell & filesystem I/O
│   ├── src/
│   │   ├── main.rs                # Entry point & single-instance lock
│   │   ├── fs_ops.rs              # Atomic file read/write, encoding detection
│   │   └── window.rs              # Windows 11 Mica/Acrylic backdrop setup
│   └── tauri.conf.json
├── src/
│   ├── core/
│   │   ├── editor/                # CodeMirror 6 extensions, keymaps, compartments
│   │   ├── markdown/
│   │   │   ├── pipeline.ts        # Unified AST processor
│   │   │   ├── rehypeSourceMap.ts # Injects data-line attributes for scroll sync
│   │   │   ├── calloutPlugin.ts   # Parses [!NOTE], [!WARNING], [!TIP] blocks
│   │   │   └── codeBlockHeader.ts # Injects language badge & copy button into <pre>
│   │   ├── html-sandbox/
│   │   │   ├── sandboxHost.ts     # PostMessage controller & blob URL manager
│   │   │   └── sandboxRuntime.ts  # Injected script for idiomorph & console capture
│   │   └── sync/
│   │       └── scrollSync.ts      # Bidirectional piece-wise linear scroll interpolator
│   ├── store/
│   │   ├── tabStore.ts            # Multi-tab state, dirty flags, file watchers
│   │   └── settingsStore.ts       # Persisted config (font, tab size, view mode)
│   ├── components/
│   │   ├── TitleBar/              # Frameless custom Windows titlebar + tab strip
│   │   ├── Workspace/             # Resizable split-pane container (Editor | Preview)
│   │   ├── PreviewPane/           # Renders MD output or HTML iframe + Console drawer
│   │   └── StatusBar/             # Ln/Col, UTF-8/UTF-16, CRLF/LF, Word Count, Zoom
│   ├── styles/
│   │   ├── tokens.css             # CSS custom properties (Antigravity dark/light palette)
│   │   └── markdown-theme.css     # Typography, callouts, tables, and code blocks
│   └── main.tsx
├── package.json
└── tsconfig.json    
```
