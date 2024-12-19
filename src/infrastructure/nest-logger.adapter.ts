// infrastructure/logger/nest-logger.adapter.ts
import { Logger } from '@nestjs/common';

import { ILogger } from '../domain/interfaces/logger';

export class NestLoggerAdapter implements ILogger {
  private readonly logger = new Logger('App'); // nom du contexte

  log(message: string) {
    this.logger.log(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
