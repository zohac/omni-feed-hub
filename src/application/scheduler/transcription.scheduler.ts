import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ILogger } from '../../domain/interfaces/logger';

import { TranscriptionUseCases } from '../usecases/transcription.use-cases';

@Injectable()
export class TranscriptionScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly useCases: TranscriptionUseCases,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleTranscriptionSchedule() {
    this.logger.log('Enqueue transcription Job for articles...');
    await this.useCases.enqueueTranscriptionJobsForArticles();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleTranscriptionJobFinishedSchedule() {
    this.logger.log('Checking for transcription jobs finished...');
    await this.useCases.checkTranscriptionJobsFinished();
  }
}
