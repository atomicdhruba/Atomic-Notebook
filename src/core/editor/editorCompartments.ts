import { Compartment, Extension, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { html } from '@codemirror/lang-html';
import { DocumentMode } from '../../config/constants';

export const languageCompartment = new Compartment();
export const lineWrappingCompartment = new Compartment();
export const tabSizeCompartment = new Compartment();
export const readOnlyCompartment = new Compartment();

export function resolveLanguageExtension(mode: DocumentMode): Extension {
  switch (mode) {
    case 'markdown':
      return markdown();
    case 'html':
      return html();
    case 'plaintext':
      return [];
  }
}

export function reconfigureLanguage(view: EditorView, mode: DocumentMode): void {
  view.dispatch({
    effects: languageCompartment.reconfigure(resolveLanguageExtension(mode))
  });
}

export function reconfigureLineWrapping(view: EditorView, enabled: boolean): void {
  view.dispatch({
    effects: lineWrappingCompartment.reconfigure(enabled ? EditorView.lineWrapping : [])
  });
}

export function reconfigureTabSize(view: EditorView, size: number): void {
  view.dispatch({
    effects: tabSizeCompartment.reconfigure(EditorState.tabSize.of(size))
  });
}

