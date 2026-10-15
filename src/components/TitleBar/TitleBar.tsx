import React from 'react';
import { useTabStore } from '../../store/tabStore';
import { Plus, X, FileText, Code2, FileCode, Minus, Square, FolderOpen, Save } from 'lucide-react';
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
  const activeTab = useTabStore((state) => state.getActiveTab());
  const setActiveTab = useTabStore((state) => state.setActiveTab);
  const closeTab = useTabStore((state) => state.closeTab);
  const createTab = useTabStore((state) => state.createTab);
  const markSaved = useTabStore((state) => state.markSaved);

  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  const handleOpenFile = async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.openFileDialog();
    if (result) {
      const fileName = result.filePath.split(/[/\\]/).pop() ?? 'Untitled';
      const id = createTab(result.content, fileName, result.filePath);
      markSaved(id, result.filePath);
    }
  };

  const handleSaveFile = async () => {
    if (!window.electronAPI || !activeTab) return;
    let targetPath = activeTab.filePath;
    if (!targetPath) {
      targetPath = await window.electronAPI.saveFileDialog(activeTab.title);
    }
    if (targetPath) {
      await window.electronAPI.writeFile(targetPath, activeTab.content, activeTab.encoding);
      markSaved(activeTab.id, targetPath);
    }
  };

  return (
    <header
      style={{
        height: 'var(--titlebar-height)',
        backgroundColor: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        userSelect: 'none',
        overflow: 'hidden',
        WebkitAppRegion: 'drag'
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {isElectron && (
          <>
            <button
              type="button"
              onClick={handleOpenFile}
              style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              title="Open File"
            >
              <FolderOpen size={14} />
            </button>
            <button
              type="button"
              onClick={handleSaveFile}
              style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              title="Save File"
            >
              <Save size={14} />
            </button>
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitAppRegion: 'no-drag'
        } as React.CSSProperties}
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
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{tab.title}</span>
              {tab.isDirty && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', flexShrink: 0 }} />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                style={{ background: 'transparent', border: 'none', padding: '2px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
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
          style={{ background: 'transparent', border: 'none', padding: '6px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
          title="New Tab (Ctrl+T)"
        >
          <Plus size={14} />
        </button>
      </div>

      {isElectron && (
        <div style={{ display: 'flex', alignItems: 'center', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button
            type="button"
            onClick={() => window.electronAPI?.minimizeWindow()}
            style={{ width: '36px', height: '32px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title="Minimize"
          >
            <Minus size={13} />
          </button>
          <button
            type="button"
            onClick={() => window.electronAPI?.maximizeWindow()}
            style={{ width: '36px', height: '32px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title="Maximize"
          >
            <Square size={12} />
          </button>
          <button
            type="button"
            onClick={() => window.electronAPI?.closeWindow()}
            style={{ width: '36px', height: '32px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#e81123'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </header>
  );
};
