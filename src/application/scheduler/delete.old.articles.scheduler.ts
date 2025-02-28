import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger } from '../../domain/interfaces/logger';
import { ArticleUseCases } from '../usecases/article.use-cases';

@Injectable()
export class DeleteOldArticlesScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly useCases: ArticleUseCases,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleFetchFeeds() {
    this.logger.log('Starting scheduled delete old articles...');

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    await this.useCases.deleteOldRSSArticles(oneMonthAgo);

    this.logger.log('Finished scheduled delete old articles.');
  }
}
