import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger } from '../../domain/interfaces/logger';
import { AnalysisUseCases } from '../usecases/analysis.use-cases';
import { ParseFeedUseCases } from '../usecases/parse.feed.use-cases';
import { RssFeedUseCases } from '../usecases/rss-feed.use-cases';

@Injectable()
export class ParseFeedScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly parseFeedUseCase: ParseFeedUseCases,
    private readonly rssFeedUseCase: RssFeedUseCases,
    private readonly analyseUseCase: AnalysisUseCases,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleFetchFeeds() {
    this.logger.log('Starting scheduled feed fetch and analysis...');

    const feeds = await this.rssFeedUseCase.getAll();

    for (const feed of feeds) {
      await this.parseFeedUseCase.execute(feed);
    }

    await this.analyseUseCase.analysisAll();

    this.logger.log('Finished scheduled feed fetch and analysis.');
  }
}
