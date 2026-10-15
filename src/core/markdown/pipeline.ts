import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { calloutPlugin } from './calloutPlugin';
import { rehypeSourceMap } from './rehypeSourceMap';
import { codeBlockHeader } from './codeBlockHeader';
import { appLogger } from '../../utils/logger';

const logger = appLogger.createScope('markdownPipeline');

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      'class',
      'data-line',
      'data-callout',
      'data-action',
      'ariaLabel',
      'aria-label'
    ],
    button: ['className', 'class', 'type', 'data-action', 'aria-label'],
    div: ['className', 'class', 'data-callout', 'data-line'],
    span: ['className', 'class'],
    code: ['className', 'class']
  }
};

const markdownProcessor = unified()
  .use(remarkParse)
  .use(calloutPlugin)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSourceMap)
  .use(codeBlockHeader)
  .use(rehypeKatex)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeStringify);

export async function renderMarkdownToHtml(markdownContent: string): Promise<string> {
  if (!markdownContent.trim()) {
    return '';
  }

  try {
    const file = await markdownProcessor.process(markdownContent);
    return String(file);
  } catch (err) {
    logger.error('Failed to parse Markdown document into HTML', err);
    return `<div class="callout callout-caution"><div class="callout-title">Rendering Error</div><p>${
      err instanceof Error ? err.message : 'Unknown Markdown compilation error'
    }</p></div>`;
  }
}
