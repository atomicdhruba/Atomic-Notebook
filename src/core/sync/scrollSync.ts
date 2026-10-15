import { EditorView } from '@codemirror/view';
import { TIMINGS } from '../../config/constants';

interface LineAnchor {
  line: number;
  top: number;
}

export interface ScrollSyncOptions {
  view: EditorView;
  previewElement: HTMLElement;
}

export class ScrollSynchronizer {
  private view: EditorView;
  private previewElement: HTMLElement;
  private isSyncing = false;
  private syncTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private anchors: LineAnchor[] = [];

  constructor(options: ScrollSyncOptions) {
    this.view = options.view;
    this.previewElement = options.previewElement;

    this.attach();
  }

  public rebuildAnchors(): void {
    const elements = this.previewElement.querySelectorAll<HTMLElement>('[data-line]');
    const anchors: LineAnchor[] = [];

    elements.forEach((el) => {
      const lineStr = el.getAttribute('data-line');
      if (!lineStr) return;
      const line = parseInt(lineStr, 10);
      if (Number.isFinite(line)) {
        anchors.push({ line, top: el.offsetTop });
      }
    });

    anchors.sort((a, b) => a.line - b.line);
    this.anchors = anchors;
  }

  private handleEditorScroll = (): void => {
    if (this.isSyncing) return;
    this.isSyncing = true;

    if (this.anchors.length === 0) {
      this.rebuildAnchors();
    }

    const scrollDOM = this.view.scrollDOM;
    const topBlock = this.view.lineBlockAtHeight(scrollDOM.scrollTop);
    const lineNum = this.view.state.doc.lineAt(topBlock.from).number;
    const ratio = (scrollDOM.scrollTop - topBlock.top) / Math.max(1, topBlock.height);
    const currentLine = lineNum + ratio;

    const targetTop = this.interpolatePreviewTop(currentLine);
    this.previewElement.scrollTop = targetTop;

    this.releaseLock();
  };

  private handlePreviewScroll = (): void => {
    if (this.isSyncing) return;
    this.isSyncing = true;

    if (this.anchors.length === 0) {
      this.rebuildAnchors();
    }

    const previewTop = this.previewElement.scrollTop;
    const targetLine = this.interpolateEditorLine(previewTop);

    const doc = this.view.state.doc;
    const clampedLine = Math.max(1, Math.min(doc.lines, Math.floor(targetLine)));
    const lineObj = doc.line(clampedLine);
    const lineBlock = this.view.lineBlockAt(lineObj.from);

    const fractionalOffset = (targetLine - clampedLine) * lineBlock.height;
    this.view.scrollDOM.scrollTop = lineBlock.top + fractionalOffset;

    this.releaseLock();
  };

  private interpolatePreviewTop(line: number): number {
    if (this.anchors.length === 0) {
      const maxEditor = this.view.scrollDOM.scrollHeight - this.view.scrollDOM.clientHeight;
      const progress = maxEditor > 0 ? this.view.scrollDOM.scrollTop / maxEditor : 0;
      return progress * (this.previewElement.scrollHeight - this.previewElement.clientHeight);
    }

    const first = this.anchors[0];
    const last = this.anchors[this.anchors.length - 1];

    if (!first || !last) return 0;
    if (line <= first.line) return first.top;
    if (line >= last.line) return last.top;

    for (let i = 0; i < this.anchors.length - 1; i++) {
      const a = this.anchors[i];
      const b = this.anchors[i + 1];
      if (a && b && line >= a.line && line <= b.line) {
        const factor = (line - a.line) / (b.line - a.line);
        return a.top + factor * (b.top - a.top);
      }
    }
    return 0;
  }

  private interpolateEditorLine(top: number): number {
    if (this.anchors.length === 0) {
      const maxPreview = this.previewElement.scrollHeight - this.previewElement.clientHeight;
      const progress = maxPreview > 0 ? top / maxPreview : 0;
      return 1 + progress * (this.view.state.doc.lines - 1);
    }

    const first = this.anchors[0];
    const last = this.anchors[this.anchors.length - 1];

    if (!first || !last) return 1;
    if (top <= first.top) return first.line;
    if (top >= last.top) return last.line;

    for (let i = 0; i < this.anchors.length - 1; i++) {
      const a = this.anchors[i];
      const b = this.anchors[i + 1];
      if (a && b && top >= a.top && top <= b.top) {
        const factor = (top - a.top) / (b.top - a.top);
        return a.line + factor * (b.line - a.line);
      }
    }
    return 1;
  }

  private releaseLock(): void {
    if (this.syncTimeoutId !== null) {
      clearTimeout(this.syncTimeoutId);
    }
    this.syncTimeoutId = setTimeout(() => {
      this.isSyncing = false;
      this.syncTimeoutId = null;
    }, TIMINGS.SCROLL_SYNC_THROTTLE_MS);
  }

  private attach(): void {
    this.view.scrollDOM.addEventListener('scroll', this.handleEditorScroll, { passive: true });
    this.previewElement.addEventListener('scroll', this.handlePreviewScroll, { passive: true });
  }

  public destroy(): void {
    if (this.syncTimeoutId !== null) {
      clearTimeout(this.syncTimeoutId);
    }
    this.view.scrollDOM.removeEventListener('scroll', this.handleEditorScroll);
    this.previewElement.removeEventListener('scroll', this.handlePreviewScroll);
  }
}
