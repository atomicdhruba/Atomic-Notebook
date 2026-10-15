import { generateSandboxedHtml, ConsolePayload } from './sandboxRuntime';
import idiomorphRaw from 'idiomorph/dist/idiomorph.js?raw';

export interface SandboxHostOptions {
  iframe: HTMLIFrameElement;
  onConsoleLog?: (payload: ConsolePayload) => void;
}

export class SandboxHost {
  private iframe: HTMLIFrameElement;
  private currentBlobUrl: string | null = null;
  private onConsoleLog?: (payload: ConsolePayload) => void;
  private isLoaded = false;
  private pendingContent: string | null = null;

  constructor(options: SandboxHostOptions) {
    this.iframe = options.iframe;
    this.onConsoleLog = options.onConsoleLog;

    window.addEventListener('message', this.handleWindowMessage);
    this.iframe.addEventListener('load', this.handleIframeLoad);
  }

  private handleWindowMessage = (event: MessageEvent): void => {
    /* Verify message originated from our sandboxed iframe window */
    if (event.source !== this.iframe.contentWindow) return;
    const data = event.data;
    if (data && data.type === 'NOTCHPAD_CONSOLE') {
      this.onConsoleLog?.(data.payload as ConsolePayload);
    }
  };

  private handleIframeLoad = (): void => {
    this.isLoaded = true;
    if (this.pendingContent !== null) {
      this.postUpdate(this.pendingContent);
      this.pendingContent = null;
    }
  };

  public init(initialContent: string): void {
    const fullHtml = generateSandboxedHtml(initialContent, idiomorphRaw);
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }
    const blob = new Blob([fullHtml], { type: 'text/html' });
    this.currentBlobUrl = URL.createObjectURL(blob);
    this.iframe.src = this.currentBlobUrl;
  }

  public updateContent(content: string): void {
    if (!this.isLoaded) {
      this.pendingContent = content;
      return;
    }
    this.postUpdate(content);
  }

  private postUpdate(content: string): void {
    try {
      this.iframe.contentWindow?.postMessage(
        {
          type: 'NOTCHPAD_HTML_UPDATE',
          content
        },
        '*'
      );
    } catch {
      /* Suppress postMessage dispatch exceptions during iframe unload cycles */
    }
  }

  public destroy(): void {
    window.removeEventListener('message', this.handleWindowMessage);
    this.iframe.removeEventListener('load', this.handleIframeLoad);
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
  }
}
