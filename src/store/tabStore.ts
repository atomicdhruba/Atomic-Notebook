import { create } from 'zustand';
import {
  DocumentMode,
  LineEnding,
  SupportedEncoding,
  FILE_EXTENSIONS
} from '../config/constants';
import { appLogger } from '../utils/logger';

const logger = appLogger.createScope('tabStore');

export interface TabItem {
  id: string;
  title: string;
  filePath: string | null;
  content: string;
  savedContent: string;
  isDirty: boolean;
  documentMode: DocumentMode;
  lineEnding: LineEnding;
  encoding: SupportedEncoding;
  cursorLine: number;
  cursorCol: number;
  scrollPercent: number;
}

interface TabState {
  tabs: TabItem[];
  activeTabId: string;
  createTab: (content?: string, title?: string, filePath?: string | null) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  markSaved: (id: string, filePath: string) => void;
  setDocumentMode: (id: string, mode: DocumentMode) => void;
  setLineEnding: (id: string, ending: LineEnding) => void;
  setEncoding: (id: string, encoding: SupportedEncoding) => void;
  updateCursor: (id: string, line: number, col: number) => void;
  updateScroll: (id: string, percent: number) => void;
  getActiveTab: () => TabItem | undefined;
}

function detectModeFromPath(filePath: string | null): DocumentMode {
  if (!filePath) return 'markdown';
  const lower = filePath.toLowerCase();
  if (FILE_EXTENSIONS.MARKDOWN.some((ext) => lower.endsWith(ext))) return 'markdown';
  if (FILE_EXTENSIONS.HTML.some((ext) => lower.endsWith(ext))) return 'html';
  return 'plaintext';
}

function detectLineEnding(text: string): LineEnding {
  return text.includes('\r\n') ? 'CRLF' : 'LF';
}

function createTabItem(content = '', title = 'Untitled-1', filePath: string | null = null): TabItem {
  return {
    id: crypto.randomUUID(),
    title,
    filePath,
    content,
    savedContent: content,
    isDirty: false,
    documentMode: detectModeFromPath(filePath),
    lineEnding: detectLineEnding(content),
    encoding: 'UTF-8',
    cursorLine: 1,
    cursorCol: 1,
    scrollPercent: 0
  };
}

const INITIAL_DOCUMENT = `# Atomic Notebook — Next-Gen Windows Notebook

> [!NOTE]
> Engineered with CodeMirror 6, Unified Markdown pipeline, and Antigravity 2.0 theme.

> [!TIP]
> Drag the central divider to adjust the split editor and live preview panes.

### Architecture Overview
| Component | Engine | Purpose |
| :--- | :--- | :--- |
| **Editor** | CodeMirror 6 | Zero-lag typing & syntax highlighting |
| **Pipeline** | Unified + Remark | Live AST compilation & sanitization |
| **Theme** | Windows 11 Acrylic | High-contrast Antigravity 2.0 design |

### Architecture Flowchart
\`\`\`mermaid
graph LR
  A[CodeMirror 6] -->|Unified AST| B(Remark + Rehype)
  B -->|Source Mapped| C[Live Preview]
  C -->|Idiomorph| D((DOM Morph))
\`\`\`

### Code Block with Instant Copy
\`\`\`typescript
interface SystemConfig {
  readonly runtime: 'Tauri' | 'Electron';
  readonly refreshRateMs: number;
}
\`\`\`

### KaTeX Formula Rendering
$$\\oint_{\\partial \\Sigma} \\mathbf{B} \\cdot d\\boldsymbol{\\ell} = \\mu_0 \\left( I_{\\text{enc}} + \\varepsilon_0 \\frac{d\\Phi_E}{dt} \\right)$$

- [x] Phase 1: CodeMirror 6 Core Workspace
- [x] Phase 2: Antigravity Markdown Theme & AST Pipeline
- [x] Phase 3: Bidirectional Scroll Synchronization & Live HTML Sandbox
- [x] Phase 4: Native Desktop Packaging & GitHub Pages Release
`;

const initialTab = createTabItem(INITIAL_DOCUMENT);



export const useTabStore = create<TabState>((set, get) => ({
  tabs: [initialTab],
  activeTabId: initialTab.id,

  createTab: (content = '', title, filePath = null) => {
    const tabCount = get().tabs.length + 1;
    const resolvedTitle = title ?? `Untitled-${tabCount}`;
    const newTab = createTabItem(content, resolvedTitle, filePath);
    logger.debug(`Tab created: ${newTab.id} (${resolvedTitle})`);

    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id
    }));
    return newTab.id;
  },

  closeTab: (id: string) => {
    const { tabs, activeTabId } = get();
    const targetIndex = tabs.findIndex((t) => t.id === id);
    if (targetIndex === -1) return;

    const remaining = tabs.filter((t) => t.id !== id);
    if (remaining.length === 0) {
      const fallback = createTabItem();
      set({ tabs: [fallback], activeTabId: fallback.id });
      return;
    }

    /* Clamp index to right-adjacent or nearest preceding neighbor when active tab closes */
    let nextActiveId = activeTabId;
    if (activeTabId === id) {
      const nextIndex = Math.min(targetIndex, remaining.length - 1);
      const nextTab = remaining[nextIndex];
      if (nextTab) {
        nextActiveId = nextTab.id;
      }
    }

    set({ tabs: remaining, activeTabId: nextActiveId });
  },

  setActiveTab: (id: string) => {
    if (get().activeTabId === id) return;
    set({ activeTabId: id });
  },

  updateContent: (id: string, content: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        return {
          ...tab,
          content,
          isDirty: content !== tab.savedContent
        };
      })
    }));
  },

  markSaved: (id: string, filePath: string) => {
    const fileName = filePath.split(/[/\\]/).pop() ?? 'Untitled';
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        return {
          ...tab,
          filePath,
          title: fileName,
          savedContent: tab.content,
          isDirty: false,
          documentMode: detectModeFromPath(filePath)
        };
      })
    }));
  },

  setDocumentMode: (id: string, documentMode: DocumentMode) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, documentMode } : tab))
    }));
  },

  setLineEnding: (id: string, lineEnding: LineEnding) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, lineEnding } : tab))
    }));
  },

  setEncoding: (id: string, encoding: SupportedEncoding) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, encoding } : tab))
    }));
  },

  updateCursor: (id: string, cursorLine: number, cursorCol: number) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, cursorLine, cursorCol } : tab))
    }));
  },

  updateScroll: (id: string, scrollPercent: number) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, scrollPercent } : tab))
    }));
  },

  getActiveTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((t) => t.id === activeTabId);
  }
}));
