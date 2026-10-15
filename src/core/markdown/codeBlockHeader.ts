import { Plugin } from 'unified';
import { Root as HastRoot, Element, ElementContent } from 'hast';
import { visit } from 'unist-util-visit';

function extractLanguage(codeElement: Element): string {
  const className = codeElement.properties?.className;
  if (!Array.isArray(className)) return 'TEXT';

  for (const cls of className) {
    if (typeof cls === 'string' && cls.startsWith('language-')) {
      return cls.replace('language-', '').toUpperCase();
    }
  }
  return 'TEXT';
}

export const codeBlockHeader: Plugin<[], HastRoot> = () => {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;

      /* Ignore pre blocks that have already been converted to wrappers */
      const existingClass = node.properties?.className;
      if (Array.isArray(existingClass) && existingClass.includes('processed-pre')) {
        return;
      }

      const codeChild = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code'
      );

      const language = codeChild ? extractLanguage(codeChild) : 'TEXT';

      const headerElement: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-header'] },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['code-block-lang'] },
            children: [{ type: 'text', value: language }]
          },
          {
            type: 'element',
            tagName: 'button',
            properties: {
              className: ['code-copy-btn'],
              type: 'button',
              'data-action': 'copy'
            },
            children: [{ type: 'text', value: 'Copy' }]
          }
        ]
      };

      node.properties = {
        ...node.properties,
        className: [...(Array.isArray(node.properties?.className) ? node.properties.className : []), 'processed-pre']
      };

      const wrapperElement: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-wrapper'] },
        children: [headerElement, node]
      };

      (parent.children as ElementContent[])[index] = wrapperElement;
    });
  };
};
