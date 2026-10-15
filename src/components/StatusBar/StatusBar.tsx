import React, { useMemo } from 'react';
import { useTabStore } from '../../store/tabStore';

export const StatusBar: React.FC = () => {
  const activeTab = useTabStore((state) => state.getActiveTab());

  const stats = useMemo(() => {
    if (!activeTab) return { words: 0, characters: 0 };
    const text = activeTab.content;
    const trimmed = text.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    return {
      words,
      characters: text.length
    };
  }, [activeTab?.content]);

  if (!activeTab) return null;

  return (
    <footer
      style={{
        height: 'var(--statusbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>
          Ln {activeTab.cursorLine}, Col {activeTab.cursorCol}
        </span>
        <span>
          {stats.words} words, {stats.characters} chars
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ textTransform: 'uppercase' }}>{activeTab.documentMode}</span>
        <span>{activeTab.encoding}</span>
        <span>{activeTab.lineEnding}</span>
      </div>
    </footer>
  );
};
