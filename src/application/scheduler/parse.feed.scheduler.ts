import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger } from '../../domain/interfaces/logger';
import { ParseFeedUseCase } from '../usecases/parse.feed.use-case';
import { RssFeedUseCases } from '../usecases/rss-feed.use-cases';

@Injectable()
export class ParseFeedScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly parseFeedUseCase: ParseFeedUseCase,
    private readonly rssFeedUseCase: RssFeedUseCases,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleFetchFeeds() {
    this.logger.log('Starting scheduled feed fetch and analysis...');

    const feeds = await this.rssFeedUseCase.getAll();

    for (const feed of feeds) {
      await this.parseFeedUseCase.execute(feed);
    }

    this.logger.log('Finished scheduled feed fetch and analysis.');
  }
}
