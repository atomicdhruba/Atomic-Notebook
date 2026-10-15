export interface ConsolePayload {
  level: 'log' | 'info' | 'warn' | 'error';
  messages: string[];
  timestamp: string;
}

export interface SandboxMessage {
  type: 'ATOMIC_HTML_UPDATE';
  content: string;
}

export const INJECTED_RUNTIME_CODE = `
(function() {
  const serializeArg = (arg) => {
    if (arg instanceof Error) return arg.stack || arg.message;
    if (typeof arg === 'object' && arg !== null) {
      try { return JSON.stringify(arg); } catch { return String(arg); }
    }
    return String(arg);
  };

  const dispatchConsole = (level, args) => {
    try {
      window.parent.postMessage({
        type: 'ATOMIC_CONSOLE',
        payload: {
          level,
          messages: Array.from(args).map(serializeArg),
          timestamp: new Date().toISOString()
        }
      }, '*');
    } catch {
      /* Suppress IPC postMessage boundary serialization failures */
    }
  };

  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => { originalLog.apply(console, args); dispatchConsole('log', args); };
  console.info = (...args) => { originalInfo.apply(console, args); dispatchConsole('info', args); };
  console.warn = (...args) => { originalWarn.apply(console, args); dispatchConsole('warn', args); };
  console.error = (...args) => { originalError.apply(console, args); dispatchConsole('error', args); };

  window.addEventListener('error', (event) => {
    dispatchConsole('error', [event.error || event.message]);
  });

  window.addEventListener('unhandledrejection', (event) => {
    dispatchConsole('error', ['Unhandled Promise Rejection: ' + (event.reason ? serializeArg(event.reason) : 'Unknown')]);
  });

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || data.type !== 'ATOMIC_HTML_UPDATE') return;

    try {
      const parser = new DOMParser();
      const nextDoc = parser.parseFromString(data.content, 'text/html');

      if (window.Idiomorph && typeof window.Idiomorph.morph === 'function') {
        window.Idiomorph.morph(document.body, nextDoc.body, { morphStyle: 'innerHTML' });
      } else {
        document.body.innerHTML = nextDoc.body.innerHTML;
      }
    } catch (err) {
      dispatchConsole('error', ['DOM Morphing Failure: ' + serializeArg(err)]);
    }
  });
})();
`;

export function generateSandboxedHtml(content: string, idiomorphSource: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>${idiomorphSource}</script>
  <script>${INJECTED_RUNTIME_CODE}</script>
</head>
<body>
${content}
</body>
</html>`;
}
