import React, { useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar/TitleBar';
import { StatusBar } from './components/StatusBar/StatusBar';
import { Workspace } from './components/Workspace/Workspace';
import { CodeEditor } from './components/Editor/CodeEditor';
import { PreviewPane } from './components/PreviewPane/PreviewPane';
import { useTabStore } from './store/tabStore';
import { appLogger } from './utils/logger';

const logger = appLogger.createScope('App');

export const App: React.FC = () => {
  const activeTab = useTabStore((state) => state.getActiveTab());
  const activeTabId = useTabStore((state) => state.activeTabId);
  const updateContent = useTabStore((state) => state.updateContent);
  const updateCursor = useTabStore((state) => state.updateCursor);
  const createTab = useTabStore((state) => state.createTab);
  const closeTab = useTabStore((state) => state.closeTab);

  const handleDocChange = useCallback(
    (content: string) => {
      if (!activeTabId) return;
      updateContent(activeTabId, content);
    },
    [activeTabId, updateContent]
  );

  const handleCursorChange = useCallback(
    (line: number, col: number) => {
      if (!activeTabId) return;
      updateCursor(activeTabId, line, col);
    },
    [activeTabId, updateCursor]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        createTab();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTabId, createTab, closeTab]);

  useEffect(() => {
    logger.info(`NotchPad initialized with active tab: ${activeTabId}`);
  }, [activeTabId]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden'
      }}
    >
      <TitleBar />
      <main
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        {activeTab ? (
          <Workspace
            editorNode={
              <CodeEditor
                key={activeTab.id}
                initialContent={activeTab.content}
                documentMode={activeTab.documentMode}
                onDocChange={handleDocChange}
                onCursorChange={handleCursorChange}
              />
            }
            previewNode={
              <PreviewPane
                content={activeTab.content}
                documentMode={activeTab.documentMode}
              />
            }
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            No active tabs. Press Ctrl+T to open a new tab.
          </div>
        )}
      </main>
      <StatusBar />
    </div>
  );
};
