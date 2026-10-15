import React from 'react';
import { useTabStore } from '../../store/tabStore';
import { Plus, X, FileText, Code2, FileCode } from 'lucide-react';
import { DocumentMode } from '../../config/constants';

function getModeIcon(mode: DocumentMode) {
  switch (mode) {
    case 'markdown':
      return <FileText size={13} style={{ color: 'var(--accent-primary)' }} />;
    case 'html':
      return <Code2 size={13} style={{ color: '#e44d26' }} />;
    case 'plaintext':
      return <FileCode size={13} style={{ color: 'var(--text-secondary)' }} />;
  }
}

export const TitleBar: React.FC = () => {
  const tabs = useTabStore((state) => state.tabs);
  const activeTabId = useTabStore((state) => state.activeTabId);
  const setActiveTab = useTabStore((state) => state.setActiveTab);
  const closeTab = useTabStore((state) => state.closeTab);
  const createTab = useTabStore((state) => state.createTab);

  return (
    <header
      style={{
        height: 'var(--titlebar-height)',
        backgroundColor: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                height: 'var(--tab-height)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 10px',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                borderBottom: isActive ? '1px solid var(--bg-surface)' : 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                maxWidth: '180px',
                minWidth: '110px'
              }}
            >
              {getModeIcon(tab.documentMode)}
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}
              >
                {tab.title}
              </span>

              {tab.isDirty && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    flexShrink: 0
                  }}
                />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '2px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
                title="Close Tab"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => createTab()}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
          title="New Tab (Ctrl+T)"
        >
          <Plus size={14} />
        </button>
      </div>
    </header>
  );
};
