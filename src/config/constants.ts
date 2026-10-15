export const TIMINGS = {
  PREVIEW_RENDER_DEBOUNCE_MS: 120,
  EDITOR_CHANGE_DEBOUNCE_MS: 150,
  SEARCH_DEBOUNCE_MS: 200,
  AUTO_SAVE_DEBOUNCE_MS: 1000,
  SCROLL_SYNC_THROTTLE_MS: 16
} as const;

export const EDITOR_DEFAULTS = {
  TAB_SIZE: 2,
  FONT_SIZE: 14,
  FONT_FAMILY: "Consolas, 'Cascadia Code', 'Fira Code', monospace",
  LINE_WRAPPING: true,
  LINE_NUMBERS: true,
  FOLD_GUTTER: true,
  HIGHLIGHT_ACTIVE_LINE: true
} as const;

export const KEYBINDINGS = {
  NEW_TAB: 'Mod-t',
  CLOSE_TAB: 'Mod-w',
  SAVE: 'Mod-s',
  SAVE_AS: 'Mod-Shift-s',
  OPEN_FILE: 'Mod-o',
  TOGGLE_PREVIEW: 'Mod-p',
  ZOOM_IN: 'Mod-=',
  ZOOM_OUT: 'Mod--',
  ZOOM_RESET: 'Mod-0'
} as const;

export const IPC_CHANNELS = {
  FS_READ_FILE: 'atomic:fs:read',
  FS_WRITE_FILE: 'atomic:fs:write',
  FS_SHOW_OPEN_DIALOG: 'atomic:dialog:open',
  FS_SHOW_SAVE_DIALOG: 'atomic:dialog:save',
  WINDOW_MINIMIZE: 'atomic:window:minimize',
  WINDOW_MAXIMIZE: 'atomic:window:maximize',
  WINDOW_CLOSE: 'atomic:window:close'
} as const;

export const FILE_EXTENSIONS = {
  MARKDOWN: ['.md', '.markdown', '.mdown', '.mkd'],
  HTML: ['.html', '.htm', '.xhtml'],
  TEXT: ['.txt', '.log', '.ini', '.conf']
} as const;

export const LINE_ENDINGS = {
  CRLF: '\r\n',
  LF: '\n'
} as const;

export const SUPPORTED_ENCODINGS = [
  'UTF-8',
  'UTF-16LE',
  'UTF-16BE',
  'windows-1252',
  'ISO-8859-1'
] as const;

export type SupportedEncoding = (typeof SUPPORTED_ENCODINGS)[number];
export type LineEnding = 'CRLF' | 'LF';
export type DocumentMode = 'markdown' | 'html' | 'plaintext';
export type ViewMode = 'split' | 'editor' | 'preview';
export type ThemeMode = 'dark' | 'light' | 'system';
