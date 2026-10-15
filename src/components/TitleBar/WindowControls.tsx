import React from 'react';
import { Minus, Square, X } from 'lucide-react';

export const WindowControls: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => window.electronAPI?.minimizeWindow()}
        style={{
          width: '36px',
          height: '32px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}
        title="Minimize"
      >
        <Minus size={13} />
      </button>
      <button
        type="button"
        onClick={() => window.electronAPI?.maximizeWindow()}
        style={{
          width: '36px',
          height: '32px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}
        title="Maximize"
      >
        <Square size={11} />
      </button>
      <button
        type="button"
        onClick={() => window.electronAPI?.closeWindow()}
        style={{
          width: '36px',
          height: '32px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#e81123';
          (e.currentTarget as HTMLElement).style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }}
        title="Close"
      >
        <X size={13} />
      </button>
    </div>
  );
};
