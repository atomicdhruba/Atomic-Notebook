import {
  EditorState,
  Extension
} from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine
} from '@codemirror/view';
import {
  foldGutter,
  indentOnInput,
  bracketMatching,
  foldKeymap
} from '@codemirror/language';
import {
  history,
  defaultKeymap,
  historyKeymap,
  indentWithTab
} from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap
} from '@codemirror/autocomplete';
import { getEditorThemeExtension } from './editorTheme';
import {
  languageCompartment,
  lineWrappingCompartment,
  tabSizeCompartment,
  readOnlyCompartment,
  resolveLanguageExtension
} from './editorCompartments';
import {
  DocumentMode,
  EDITOR_DEFAULTS
} from '../../config/constants';

export interface EditorInitOptions {
  parent: HTMLElement;
  initialContent?: string;
  documentMode?: DocumentMode;
  tabSize?: number;
  lineWrapping?: boolean;
  readOnly?: boolean;
  onDocChange?: (content: string) => void;
  onCursorChange?: (line: number, col: number) => void;
}

export interface NotchpadEditorInstance {
  view: EditorView;
  destroy: () => void;
}

export function createNotchpadEditor(options: EditorInitOptions): NotchpadEditorInstance {
  const {
    parent,
    initialContent = '',
    documentMode = 'markdown',
    tabSize = EDITOR_DEFAULTS.TAB_SIZE,
    lineWrapping = EDITOR_DEFAULTS.LINE_WRAPPING,
    readOnly = false,
    onDocChange,
    onCursorChange
  } = options;

  let lastHead = -1;

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && onDocChange) {
      onDocChange(update.state.doc.toString());
    }

    /* Prevent redundant cursor callback dispatches when typing doesn't alter caret line/column */
    if (update.selectionSet && onCursorChange) {
      const head = update.state.selection.main.head;
      if (head !== lastHead) {
        lastHead = head;
        const line = update.state.doc.lineAt(head);
        onCursorChange(line.number, head - line.from + 1);
      }
    }
  });

  const extensions: Extension[] = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    getEditorThemeExtension(),
    updateListener,
    languageCompartment.of(resolveLanguageExtension(documentMode)),
    lineWrappingCompartment.of(lineWrapping ? EditorView.lineWrapping : []),
    tabSizeCompartment.of(EditorState.tabSize.of(tabSize)),
    readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTab
    ])
  ];

  const state = EditorState.create({
    doc: initialContent,
    extensions
  });

  const view = new EditorView({
    state,
    parent
  });

  return {
    view,
    destroy: () => {
      view.destroy();
    }
  };
}
