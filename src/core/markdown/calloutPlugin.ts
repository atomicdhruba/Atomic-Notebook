import { Plugin } from 'unified';
import { Root, Blockquote, Paragraph, Html } from 'mdast';
import { visit } from 'unist-util-visit';

const CALLOUT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i;

const CALLOUT_ICONS: Record<string, string> = {
  note: 'ℹ',
  tip: '💡',
  important: '★',
  warning: '⚠',
  caution: '🛑'
};

export const calloutPlugin: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      if (node.children.length === 0) return;
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== 'paragraph' || firstChild.children.length === 0) return;

      const firstInline = firstChild.children[0];
      if (!firstInline || firstInline.type !== 'text') return;

      const lines = firstInline.value.split('\n');
      const firstLine = lines[0];
      if (!firstLine) return;

      const match = CALLOUT_REGEX.exec(firstLine.trim());
      if (!match) return;

      const typeKey = (match[1] ?? 'NOTE').toLowerCase();
      const customTitle = match[2]?.trim();
      const title = customTitle && customTitle.length > 0 ? customTitle : typeKey.toUpperCase();
      const icon = CALLOUT_ICONS[typeKey] ?? 'ℹ';

      /* Strip the callout marker from MDAST while preserving any downstream inline text */
      const remainingFirstLine = '';
      if (lines.length > 1) {
        firstInline.value = [remainingFirstLine, ...lines.slice(1)].join('\n').trimStart();
      } else {
        firstChild.children.shift();
      }

      const titleNode: Html = {
        type: 'html',
        value: `<div class="callout-title"><span class="callout-icon">${icon}</span><span>${title}</span></div>`
      };

      node.children.unshift(titleNode as unknown as Paragraph);

      node.data = {
        ...node.data,
        hName: 'div',
        hProperties: {
          className: ['callout', `callout-${typeKey}`],
          'data-callout': typeKey
        }
      };
    });
  };
};
