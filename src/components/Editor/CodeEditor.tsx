import React, { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import {
  createNotchpadEditor,
  reconfigureLanguage,
  reconfigureLineWrapping,
  reconfigureTabSize
} from '../../core/editor';
import { DocumentMode } from '../../config/constants';

interface CodeEditorProps {
  initialContent: string;
  documentMode: DocumentMode;
  tabSize?: number;
  lineWrapping?: boolean;
  readOnly?: boolean;
  onDocChange: (content: string) => void;
  onCursorChange?: (line: number, col: number) => void;
  onViewReady?: (view: EditorView | null) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialContent,
  documentMode,
  tabSize = 2,
  lineWrapping = true,
  readOnly = false,
  onDocChange,
  onCursorChange,
  onViewReady
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const docChangeCallbackRef = useRef(onDocChange);
  const cursorChangeCallbackRef = useRef(onCursorChange);
  const onViewReadyRef = useRef(onViewReady);

  docChangeCallbackRef.current = onDocChange;
  cursorChangeCallbackRef.current = onCursorChange;
  onViewReadyRef.current = onViewReady;

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = createNotchpadEditor({
      parent: containerRef.current,
      initialContent,
      documentMode,
      tabSize,
      lineWrapping,
      readOnly,
      onDocChange: (content) => docChangeCallbackRef.current(content),
      onCursorChange: (line, col) => cursorChangeCallbackRef.current?.(line, col)
    });

    viewRef.current = instance.view;
    onViewReadyRef.current?.(instance.view);

    return () => {
      onViewReadyRef.current?.(null);
      instance.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    reconfigureLanguage(view, documentMode);
  }, [documentMode]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    reconfigureLineWrapping(view, lineWrapping);
  }, [lineWrapping]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    reconfigureTabSize(view, tabSize);
  }, [tabSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    />
  );
};
