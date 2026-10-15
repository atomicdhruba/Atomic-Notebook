export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};

class Logger {
  private currentLevel: LogLevel = 'info';

  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  public getLevel(): LogLevel {
    return this.currentLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITIES[level] >= LOG_LEVEL_PRIORITIES[this.currentLevel];
  }

  private formatMessage(level: LogLevel, scope: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${scope}] ${message}`;
  }

  public debug(scope: string, message: string, context?: unknown): void {
    if (!this.shouldLog('debug')) return;
    const formatted = this.formatMessage('debug', scope, message);
    if (context !== undefined) {
      console.debug(formatted, context);
    } else {
      console.debug(formatted);
    }
  }

  public info(scope: string, message: string, context?: unknown): void {
    if (!this.shouldLog('info')) return;
    const formatted = this.formatMessage('info', scope, message);
    if (context !== undefined) {
      console.info(formatted, context);
    } else {
      console.info(formatted);
    }
  }

  public warn(scope: string, message: string, context?: unknown): void {
    if (!this.shouldLog('warn')) return;
    const formatted = this.formatMessage('warn', scope, message);
    if (context !== undefined) {
      console.warn(formatted, context);
    } else {
      console.warn(formatted);
    }
  }

  public error(scope: string, message: string, error?: unknown): void {
    if (!this.shouldLog('error')) return;
    const formatted = this.formatMessage('error', scope, message);
    if (error !== undefined) {
      console.error(formatted, error);
    } else {
      console.error(formatted);
    }
  }

  public createScope(scope: string) {
    return {
      debug: (message: string, context?: unknown) => this.debug(scope, message, context),
      info: (message: string, context?: unknown) => this.info(scope, message, context),
      warn: (message: string, context?: unknown) => this.warn(scope, message, context),
      error: (message: string, error?: unknown) => this.error(scope, message, error)
    };
  }
}

export const appLogger = new Logger();
