// infrastructure/adapters/nest-logger.adapter.ts

import { Logger } from '@nestjs/common';

import { ILogger } from '../../domain/interfaces/logger';

export class NestLoggerAdapter implements ILogger {
  private readonly logger: Logger;

  constructor(private readonly context: string = 'App') {
    this.logger = new Logger(context);
  }

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
