import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger } from '../../domain/interfaces/logger';
import { RssFeedStatsUseCases } from '../usecases/rss-feed.stats.use-cases';

@Injectable()
export class RssFeedStatsScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly useCases: RssFeedStatsUseCases,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleTranscriptionSchedule() {
    this.logger.log('Sync Stats for all rss feed started...');
    await this.useCases.syncAllStats();
    this.logger.log('Sync Stats for all rss feed ended...');
  }
}
