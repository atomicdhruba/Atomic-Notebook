import { Plugin } from 'unified';
import { Root as HastRoot, Element } from 'hast';
import { visit } from 'unist-util-visit';

export const rehypeSourceMap: Plugin<[], HastRoot> = () => {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.position?.start?.line) return;

      /* Inject source line mapping onto block-level elements for piecewise scroll sync */
      if (!node.properties) {
        node.properties = {};
      }

      node.properties['data-line'] = node.position.start.line;
    });
  };
};
