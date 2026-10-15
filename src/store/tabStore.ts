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

const INITIAL_DOCUMENT = `# Welcome to Atomic Notebook ⚛️

> [!NOTE]
> Atomic Notebook is a fast, distraction-free markdown and code notebook featuring real-time preview, mathematical typesetting, and visual architecture modeling.

> [!TIP]
> Drag the central divider to customize your split view, or use the view toggles on the top toolbar for focused Editor or Preview modes.

### Key Capabilities
| Feature | Engine | Description |
| :--- | :--- | :--- |
| **Code Editor** | CodeMirror 6 | Zero-latency input, bracket pairing, and code folding |
| **Markdown Pipeline** | Unified + Remark | Live AST compilation with GitHub alerts and syntax themes |
| **Math Typesetting** | KaTeX | High-speed rendering for complex mathematical notations |
| **Diagrams** | Mermaid.js | Vector flowcharts, sequences, and state diagrams in real-time |

### Reactive Architecture
\`\`\`mermaid
graph LR
  A[Input Stream] -->|AST Pipeline| B(Unified Processor)
  B -->|Source Maps| C[Realtime Preview]
  C -->|Sync Engine| D((Bi-directional Scroll))
\`\`\`

### Code Cards with Quick Copy
\`\`\`typescript
export interface NotebookMetrics {
  readonly renderTimeMs: number;
  readonly activeTokens: number;
  readonly isSynchronized: boolean;
}
\`\`\`

### KaTeX Formula Rendering
$$\\oint_{\\partial \\Sigma} \\mathbf{B} \\cdot d\\boldsymbol{\\ell} = \\mu_0 \\left( I_{\\text{enc}} + \\varepsilon_0 \\frac{d\\Phi_E}{dt} \\right)$$

### Quick Start Checklist
- [x] Launch Atomic Notebook
- [ ] Open or create a markdown document (Ctrl + O / Ctrl + T)
- [ ] Customize Dark or Light theme from the floating toolbar
- [ ] Export or save notes to your local filesystem (Ctrl + S)
`;

const initialTab = createTabItem(INITIAL_DOCUMENT);

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [initialTab],
  activeTabId: initialTab.id,

  createTab: (content = '', title, filePath = null) => {
    const resolvedTitle = title ?? `Untitled-${get().tabs.length + 1}`;
    const newTab = createTabItem(content, resolvedTitle, filePath);
    logger.debug(`Tab created: ${newTab.id} (${resolvedTitle})`);
    set((state) => ({ tabs: [...state.tabs, newTab], activeTabId: newTab.id }));
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

    let nextActiveId = activeTabId;
    if (activeTabId === id) {
      const nextIndex = Math.min(targetIndex, remaining.length - 1);
      const fallbackTab = remaining[0];
      nextActiveId = remaining[nextIndex]?.id ?? (fallbackTab ? fallbackTab.id : '');
    }
    set({ tabs: remaining, activeTabId: nextActiveId });
  },

  setActiveTab: (id: string) => {
    if (get().activeTabId !== id) set({ activeTabId: id });
  },

  updateContent: (id: string, content: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id ? { ...tab, content, isDirty: content !== tab.savedContent } : tab
      )
    }));
  },

  markSaved: (id: string, filePath: string) => {
    const fileName = filePath.split(/[/\\]/).pop() ?? 'Untitled';
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id
          ? { ...tab, filePath, title: fileName, savedContent: tab.content, isDirty: false, documentMode: detectModeFromPath(filePath) }
          : tab
      )
    }));
  },

  setDocumentMode: (id: string, documentMode: DocumentMode) => {
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, documentMode } : tab)) }));
  },

  setLineEnding: (id: string, lineEnding: LineEnding) => {
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, lineEnding } : tab)) }));
  },

  setEncoding: (id: string, encoding: SupportedEncoding) => {
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, encoding } : tab)) }));
  },

  updateCursor: (id: string, cursorLine: number, cursorCol: number) => {
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, cursorLine, cursorCol } : tab)) }));
  },

  updateScroll: (id: string, scrollPercent: number) => {
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, scrollPercent } : tab)) }));
  },

  getActiveTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((t) => t.id === activeTabId);
  }
}));
