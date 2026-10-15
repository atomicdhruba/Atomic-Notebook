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
      /* Fallback handling for clipboard rejection */
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 12px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '12px',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            style={{
              background: viewMode === 'split' ? 'var(--accent-surface)' : 'transparent',
              color: viewMode === 'split' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 500
            }}
            title="Split Editor & Preview"
          >
            <Columns2 size={13} />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            style={{
              background: viewMode === 'editor' ? 'var(--accent-surface)' : 'transparent',
              color: viewMode === 'editor' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 500
            }}
            title="Editor Only"
          >
            <FileCode2 size={13} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            style={{
              background: viewMode === 'preview' ? 'var(--accent-surface)' : 'transparent',
              color: viewMode === 'preview' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 500
            }}
            title="Preview Reader Only"
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
        </div>

        {activeTab && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
            {(['markdown', 'html', 'plaintext'] as DocumentMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDocumentMode(activeTab.id, mode)}
                style={{
                  background: activeTab.documentMode === mode ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab.documentMode === mode ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: activeTab.documentMode === mode ? '1px solid var(--border-default)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  fontSize: '10.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                {mode === 'plaintext' ? 'txt' : mode}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setFontSize(fontSize - 1)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}
            title="Decrease Font Size"
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '24px', textAlign: 'center' }}>
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => setFontSize(fontSize + 1)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}
            title="Increase Font Size"
          >
            <ZoomIn size={13} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyDoc}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Copy Document Text"
        >
          {hasCopied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
          <span>{hasCopied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadFile}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Download File"
        >
          <Download size={12} />
          <span>Save</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={13} style={{ color: '#f59e0b' }} /> : <Moon size={13} style={{ color: '#6366f1' }} />}
        </button>
      </div>
    </div>
  );
};
