// domain/interfaces/logger.ts
export interface ILogger {
  log(message: string): void;

  warn(message: string): void;

  error(message: string, trace?: string): void;

  debug?(message: string): void;
}
