import React, { useState, useRef, useCallback } from 'react';
import { ViewMode } from '../../config/constants';

interface WorkspaceProps {
  editorNode: React.ReactNode;
  previewNode: React.ReactNode;
  viewMode?: ViewMode;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  editorNode,
  previewNode,
  viewMode = 'split'
}) => {
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const isDraggingRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      /* Constrain minimum pane width to prevent either pane from collapsing completely */
      const clamped = Math.max(15, Math.min(85, rawPercent));
      setSplitPercent(clamped);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  if (viewMode === 'editor') {
    return <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{editorNode}</div>;
  }

  if (viewMode === 'preview') {
    return <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{previewNode}</div>;
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${splitPercent}%`,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {editorNode}
      </div>

      <div
        onMouseDown={handleMouseDown}
        style={{
          width: 'var(--split-handle-size)',
          height: '100%',
          backgroundColor: 'var(--border-subtle)',
          cursor: 'col-resize',
          zIndex: 10,
          transition: 'background-color var(--transition-fast)'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--border-subtle)';
        }}
      />

      <div
        style={{
          width: `${100 - splitPercent}%`,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {previewNode}
      </div>
    </div>
  );
};
