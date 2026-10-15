import React, { useEffect, useRef, useState } from 'react';
import { SandboxHost } from '../../core/html-sandbox/sandboxHost';
import { ConsolePayload } from '../../core/html-sandbox/sandboxRuntime';
import { Terminal, Trash2 } from 'lucide-react';

interface HtmlSandboxPaneProps {
  content: string;
}

export const HtmlSandboxPane: React.FC<HtmlSandboxPaneProps> = ({ content }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hostRef = useRef<SandboxHost | null>(null);
  const [logs, setLogs] = useState<ConsolePayload[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;

    const host = new SandboxHost({
      iframe: iframeRef.current,
      onConsoleLog: (payload) => {
        setLogs((prev) => [...prev.slice(-99), payload]);
      }
    });

    host.init(content);
    hostRef.current = host;

    return () => {
      host.destroy();
      hostRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (hostRef.current) {
      hostRef.current.updateContent(content);
    }
  }, [content]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="Atomic Notebook Live HTML Preview"
        style={{
          flex: 1,
          width: '100%',
          border: 'none'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          maxHeight: isConsoleOpen ? '200px' : '30px',
          transition: 'max-height var(--transition-normal)'
        }}
      >
        <div
          onClick={() => setIsConsoleOpen((prev) => !prev)}
          style={{
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={12} />
            <span>Sandbox Console ({logs.length})</span>
          </div>

          {isConsoleOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLogs([]);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear Console"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {isConsoleOpen && (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            {logs.length === 0 ? (
              <span style={{ color: 'var(--text-muted)' }}>Console is empty.</span>
            ) : (
              logs.map((log, index) => {
                const colorMap: Record<ConsolePayload['level'], string> = {
                  log: 'var(--text-primary)',
                  info: 'var(--accent-primary)',
                  warn: 'var(--callout-warning)',
                  error: 'var(--callout-caution)'
                };
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      color: colorMap[log.level]
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>[{log.level}]</span>
                    <span>{log.messages.join(' ')}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
