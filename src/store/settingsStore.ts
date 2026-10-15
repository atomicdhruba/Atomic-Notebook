import { create } from 'zustand';
import { ThemeMode, ViewMode, EDITOR_DEFAULTS } from '../config/constants';
import { appLogger } from '../utils/logger';

const logger = appLogger.createScope('settingsStore');
const STORAGE_KEY = 'atomic_notebook_settings_v1';

export interface SettingsState {
  theme: ThemeMode;
  viewMode: ViewMode;
  fontSize: number;
  lineWrapping: boolean;
  tabSize: number;
  setTheme: (theme: ThemeMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setFontSize: (size: number) => void;
  toggleLineWrapping: () => void;
  setTabSize: (size: number) => void;
}

function loadPersistedSettings(): Partial<SettingsState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    logger.warn('Failed to parse settings from localStorage', err);
    return {};
  }
}

function persistSettings(data: Record<string, unknown>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    logger.error('Failed to write settings to localStorage', err);
  }
}

function applyThemeToDocument(theme: ThemeMode): void {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

const saved = loadPersistedSettings();
const initialTheme: ThemeMode = saved.theme ?? 'dark';
applyThemeToDocument(initialTheme);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: initialTheme,
  viewMode: saved.viewMode ?? 'split',
  fontSize: saved.fontSize ?? EDITOR_DEFAULTS.FONT_SIZE,
  lineWrapping: saved.lineWrapping ?? EDITOR_DEFAULTS.LINE_WRAPPING,
  tabSize: saved.tabSize ?? EDITOR_DEFAULTS.TAB_SIZE,

  setTheme: (theme: ThemeMode) => {
    applyThemeToDocument(theme);
    set({ theme });
    persistSettings({ ...get(), theme });
  },

  setViewMode: (viewMode: ViewMode) => {
    set({ viewMode });
    persistSettings({ ...get(), viewMode });
  },

  setFontSize: (fontSize: number) => {
    const clamped = Math.max(10, Math.min(32, fontSize));
    document.documentElement.style.setProperty('--editor-font-size', `${clamped}px`);
    set({ fontSize: clamped });
    persistSettings({ ...get(), fontSize: clamped });
  },

  toggleLineWrapping: () => {
    const next = !get().lineWrapping;
    set({ lineWrapping: next });
    persistSettings({ ...get(), lineWrapping: next });
  },

  setTabSize: (tabSize: number) => {
    const clamped = Math.max(2, Math.min(8, tabSize));
    set({ tabSize: clamped });
    persistSettings({ ...get(), tabSize: clamped });
  }
}));
