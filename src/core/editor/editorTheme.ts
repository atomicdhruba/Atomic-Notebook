import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const notchpadBaseTheme = EditorView.theme({
  '&': {
    color: 'var(--cm-fg)',
    backgroundColor: 'var(--cm-bg)',
    height: '100%',
    fontSize: 'var(--editor-font-size, 14px)',
    fontFamily: 'var(--font-mono)'
  },
  '.cm-content': {
    caretColor: 'var(--cm-cursor)',
    padding: '8px 0',
    lineHeight: '1.6'
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--cm-cursor)',
    borderLeftWidth: '2px'
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'var(--cm-selection) !important'
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--cm-active-line)'
  },
  '.cm-gutters': {
    backgroundColor: 'var(--cm-gutter-bg)',
    color: 'var(--cm-gutter-fg)',
    borderRight: '1px solid var(--border-subtle)',
    paddingRight: '6px'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: 'var(--cm-gutter-active-fg)',
    fontWeight: '600'
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    padding: '0 4px',
    margin: '0 2px'
  },
  '.cm-matchingBracket': {
    backgroundColor: 'var(--cm-matching-bracket)',
    outline: '1px solid var(--accent-primary)',
    borderRadius: '2px'
  }
});

export const notchpadHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#c678dd', fontWeight: 'bold' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: '#e06c75' },
  { tag: [t.function(t.variableName), t.labelName], color: '#61afef' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#d19a66' },
  { tag: [t.definition(t.name), t.separator], color: '#abb2bf' },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#e5c07b' },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: '#56b6c2' },
  { tag: [t.meta, t.comment], color: '#5c6370', fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: '#61afef', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#e06c75' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d19a66' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#98c379' },
  { tag: t.invalid, color: '#ffffff', backgroundColor: '#e05252' }
]);

export function getEditorThemeExtension(): Extension {
  return [notchpadBaseTheme, syntaxHighlighting(notchpadHighlightStyle)];
}
