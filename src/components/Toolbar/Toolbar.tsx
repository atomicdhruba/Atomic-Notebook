import React, { useState } from 'react';
import {
  Columns2,
  FileCode2,
  Eye,
  Sun,
  Moon,
  Download,
  Copy,
  Check,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTabStore } from '../../store/tabStore';
import { DocumentMode } from '../../config/constants';

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
  borderRadius: 'var(--radius-sm)',
  padding: '3px 8px',
  fontSize: '11px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  transition: 'all var(--transition-fast)'
};

export const Toolbar: React.FC = () => {
  const viewMode = useSettingsStore((state) => state.viewMode);
  const setViewMode = useSettingsStore((state) => state.setViewMode);
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const setFontSize = useSettingsStore((state) => state.setFontSize);

  const activeTab = useTabStore((state) => state.getActiveTab());
  const setDocumentMode = useTabStore((state) => state.setDocumentMode);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyDoc = async () => {
    if (!activeTab) return;
    try {
      await navigator.clipboard.writeText(activeTab.content);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 1500);
    } catch {
      /* Clipboard permission fallback */
    }
  };

  const handleDownloadFile = () => {
    if (!activeTab) return;
    const blob = new Blob([activeTab.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab.title.includes('.')
      ? activeTab.title
      : `${activeTab.title}.${activeTab.documentMode === 'html' ? 'html' : 'md'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 12px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '12px',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          {[
            { mode: 'split', icon: Columns2, label: 'Split' },
            { mode: 'editor', icon: FileCode2, label: 'Editor' },
            { mode: 'preview', icon: Eye, label: 'Preview' }
          ].map(({ mode, icon: Icon, label }) => {
            const isCurrent = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode as any)}
                style={{
                  background: isCurrent ? 'var(--accent-surface)' : 'transparent',
                  color: isCurrent ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: isCurrent ? 600 : 400
                }}
              >
                <Icon size={12} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {activeTab && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
            {(['markdown', 'html', 'plaintext'] as DocumentMode[]).map((mode) => {
              const isActive = activeTab.documentMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDocumentMode(activeTab.id, mode)}
                  style={{
                    background: isActive ? 'var(--bg-surface)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 7px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontWeight: isActive ? 600 : 400
                  }}
                >
                  {mode === 'plaintext' ? 'txt' : mode}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'var(--bg-surface)', padding: '1px 4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px', display: 'flex' }}
            title="Decrease Font Size"
          >
            <ZoomOut size={12} />
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '28px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => setFontSize(Math.min(32, fontSize + 1))}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px', display: 'flex' }}
            title="Increase Font Size"
          >
            <ZoomIn size={12} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyDoc}
          style={btnStyle}
          title="Copy Document Text"
        >
          {hasCopied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
          <span>{hasCopied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadFile}
          style={btnStyle}
          title="Export Document File"
        >
          <Download size={12} />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ ...btnStyle, padding: '4px 6px' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={12} style={{ color: '#f59e0b' }} /> : <Moon size={12} style={{ color: '#6366f1' }} />}
        </button>
      </div>
    </div>
  );
};
