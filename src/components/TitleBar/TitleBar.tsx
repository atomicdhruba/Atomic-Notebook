import React, { useRef } from 'react';
import { useTabStore } from '../../store/tabStore';
import {
  Atom,
  Plus,
  X,
  FileText,
  Code2,
  FileCode,
  FolderOpen,
  Save,
  Download
} from 'lucide-react';
import { DocumentMode } from '../../config/constants';
import { WindowControls } from './WindowControls';

const GithubIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

function getModeIcon(mode: DocumentMode) {
  if (mode === 'markdown') return <FileText size={12} style={{ color: 'var(--accent-primary)' }} />;
  if (mode === 'html') return <Code2 size={12} style={{ color: '#e44d26' }} />;
  return <FileCode size={12} style={{ color: 'var(--text-secondary)' }} />;
}

export const TitleBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, createTab, markSaved } = useTabStore();
  const activeTab = useTabStore((s) => s.getActiveTab());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  const handleOpen = async () => {
    if (isElectron && window.electronAPI) {
      const res = await window.electronAPI.openFileDialog();
      if (res) {
        const name = res.filePath.split(/[/\\]/).pop() ?? 'Untitled';
        const id = createTab(res.content, name, res.filePath);
        markSaved(id, res.filePath);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleWebFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      createTab((evt.target?.result as string) ?? '', file.name, null);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!activeTab) return;
    if (isElectron && window.electronAPI) {
      let path = activeTab.filePath ?? (await window.electronAPI.saveFileDialog(activeTab.title));
      if (path) {
        await window.electronAPI.writeFile(path, activeTab.content, activeTab.encoding);
        markSaved(activeTab.id, path);
      }
    } else {
      const blob = new Blob([activeTab.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeTab.title.includes('.') ? activeTab.title : `${activeTab.title}.md`;
      a.click();
      URL.revokeObjectURL(url);
      markSaved(activeTab.id, activeTab.title);
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
        padding: '0 6px',
        userSelect: 'none',
        WebkitAppRegion: isElectron ? 'drag' : 'no-drag'
      } as React.CSSProperties}
    >
      <input ref={fileInputRef} type="file" accept=".md,.markdown,.txt,.html,.js,.ts,.json" style={{ display: 'none' }} onChange={handleWebFile} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px', fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
          <Atom size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Atomic <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>Notebook</span>
          </span>
        </div>
        <button type="button" onClick={handleOpen} style={{ background: 'transparent', border: 'none', padding: '5px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }} title="Open Document (Ctrl+O)">
          <FolderOpen size={13} />
        </button>
        <button type="button" onClick={handleSave} style={{ background: 'transparent', border: 'none', padding: '5px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }} title="Save Document (Ctrl+S)">
          <Save size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, overflowX: 'auto', scrollbarWidth: 'none', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
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
                gap: '6px',
                padding: '0 8px 0 10px',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                borderBottom: isActive ? '1px solid var(--bg-surface)' : 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '11.5px',
                cursor: 'pointer',
                maxWidth: '170px',
                minWidth: '100px'
              }}
            >
              {getModeIcon(tab.documentMode)}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{tab.title}</span>
              {tab.isDirty && <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', flexShrink: 0 }} />}
              <button type="button" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} style={{ background: 'transparent', border: 'none', padding: '2px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-muted)' }} title="Close Tab">
                <X size={11} />
              </button>
            </div>
          );
        })}
        <button type="button" onClick={() => createTab()} style={{ background: 'transparent', border: 'none', padding: '5px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }} title="New Tab (Ctrl+T)">
          <Plus size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {!isElectron && (
          <>
            <a href="https://github.com/atomicdhruba/Atomic-Notebook/releases" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent-primary)', background: 'var(--accent-surface)', border: '1px solid var(--accent-border)', borderRadius: '12px', padding: '2px 8px', textDecoration: 'none', fontWeight: 500 }} title="Download Windows Desktop App">
              <Download size={11} /> <span>Get App (.exe)</span>
            </a>
            <a href="https://github.com/atomicdhruba/Atomic-Notebook" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '4px', color: 'var(--text-secondary)' }} title="View on GitHub">
              <GithubIcon size={13} />
            </a>
          </>
        )}
        {isElectron && <WindowControls />}
      </div>
    </header>
  );
};
