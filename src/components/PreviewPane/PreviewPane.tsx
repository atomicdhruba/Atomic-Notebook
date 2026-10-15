import React, { useEffect, useState, useRef } from 'react';
import { renderMarkdownToHtml } from '../../core/markdown/pipeline';
import { DocumentMode, TIMINGS } from '../../config/constants';
import { HtmlSandboxPane } from './HtmlSandboxPane';
import '../../styles/markdown-theme.css';
import 'katex/dist/katex.min.css';

interface PreviewPaneProps {
  content: string;
  documentMode: DocumentMode;
  onPreviewRef?: (el: HTMLElement | null) => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  documentMode,
  onPreviewRef
}) => {
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onPreviewRef?.(containerRef.current);
  }, [onPreviewRef]);

  useEffect(() => {
    if (documentMode === 'html') return;

    let isCancelled = false;

    const timer = setTimeout(async () => {
      if (documentMode === 'markdown') {
        const html = await renderMarkdownToHtml(content);
        if (!isCancelled) {
          setRenderedHtml(html);
        }
      } else {
        if (!isCancelled) {
          setRenderedHtml(`<pre>${content}</pre>`);
        }
      }
    }, TIMINGS.PREVIEW_RENDER_DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [content, documentMode]);

  /* Delegate copy button events on rendered code block headers */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContainerClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || !target.classList.contains('code-copy-btn')) return;

      const wrapper = target.closest('.code-block-wrapper');
      const codeElement = wrapper?.querySelector('pre code');
      const textToCopy = codeElement?.textContent ?? '';

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = target.textContent;
        target.textContent = 'Copied!';
        setTimeout(() => {
          target.textContent = originalText;
        }, 1500);
      } catch {
        target.textContent = 'Failed';
      }
    };

    container.addEventListener('click', handleContainerClick);
    return () => {
      container.removeEventListener('click', handleContainerClick);
    };
  }, []);

  if (documentMode === 'html') {
    return <HtmlSandboxPane content={content} />;
  }

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        onPreviewRef?.(el);
      }}
      className="markdown-preview"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-app)',
        boxSizing: 'border-box'
      }}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
