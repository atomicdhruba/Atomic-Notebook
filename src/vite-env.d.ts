/// <reference types="vite/client" />

declare module '*?raw' {
  const content: string;
  export default content;
}

export interface ElectronBridge {
  isElectron: boolean;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<void>;
  openFileDialog: () => Promise<{ filePath: string; content: string } | null>;
  saveFileDialog: (defaultName?: string) => Promise<string | null>;
  readFile: (filePath: string, encoding?: string) => Promise<string>;
  writeFile: (filePath: string, content: string, encoding?: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronBridge;
  }
}
