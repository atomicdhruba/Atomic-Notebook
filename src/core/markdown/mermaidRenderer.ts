import mermaid from 'mermaid';
import { appLogger } from '../../utils/logger';

const logger = appLogger.createScope('mermaidRenderer');

let isInitialized = false;

export function initializeMermaid(isDark = true): void {
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'neutral',
      securityLevel: 'loose',
      fontFamily: 'var(--font-sans)',
      themeVariables: {
        fontSize: '13px',
        primaryColor: '#1e212d',
        primaryTextColor: '#f0f2f5',
        primaryBorderColor: 'rgba(59, 130, 246, 0.4)',
        lineColor: '#3b82f6',
        secondaryColor: '#161822',
        tertiaryColor: '#11131a'
      }
    });
    isInitialized = true;
  } catch (err) {
    logger.error('Failed to initialize mermaid engine', err);
  }
}

export async function renderMermaidBlocks(container: HTMLElement, isDark = true): Promise<void> {
  initializeMermaid(isDark);
  if (!isInitialized) return;

  const codeBlocks = container.querySelectorAll<HTMLElement>('.code-block-wrapper');

  for (let i = 0; i < codeBlocks.length; i++) {
    const wrapper = codeBlocks[i];
    if (!wrapper) continue;

    const langBadge = wrapper.querySelector('.code-block-lang');
    if (!langBadge || langBadge.textContent?.trim().toLowerCase() !== 'mermaid') {
      continue;
    }

    const codeEl = wrapper.querySelector('pre code');
    const rawChart = codeEl?.textContent?.trim();
    if (!rawChart) continue;

    const diagramId = `mermaid-svg-${Date.now()}-${i}`;

    try {
      const { svg } = await mermaid.render(diagramId, rawChart);
      const diagramContainer = document.createElement('div');
      diagramContainer.className = 'mermaid-diagram-card';
      diagramContainer.innerHTML = svg;

      /* Replace the raw code block wrapper with rendered SVG diagram */
      wrapper.parentNode?.replaceChild(diagramContainer, wrapper);
    } catch (err) {
      logger.warn(`Mermaid diagram compilation error on block ${i}`, err);
    }
  }
}
