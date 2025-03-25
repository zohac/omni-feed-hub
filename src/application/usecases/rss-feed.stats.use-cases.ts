// src/application/usecases/rss-feed.stats.use-cases.ts

import { Inject } from '@nestjs/common';
import { RssFeed } from 'src/domain/entities/rss-feed';

import { RssFeedStats } from '../../domain/entities/rss-feed.stats';
import { IRssFeedStatsRepository } from '../../domain/interfaces/rss-feed.stats.repository';

export class RssFeedStatsUseCases {
  constructor(
    @Inject('IRepository<RssFeedStats>')
    private readonly repository: IRssFeedStatsRepository,
  ) {}

  async getAll(): Promise<RssFeedStats[]> {
    return await this.repository.getAll();
  }

  async syncStats(feedId: number): Promise<RssFeedStats | null> {
    let stats: RssFeedStats;
    const realTimeStats = await this.repository.getRealStatsByFeedId(feedId);
    if (!realTimeStats) return null;

    const savedStats = await this.repository.getStatsFromFeedId(feedId);

    if (savedStats) {
      savedStats.totalArticles = realTimeStats.totalArticles;
      savedStats.unreadArticles = realTimeStats.unreadArticles;
      savedStats.favoriteArticles = realTimeStats.favoriteArticles;
      savedStats.archivedArticles = realTimeStats.archivedArticles;
      savedStats.savedArticles = realTimeStats.savedArticles;

      stats = await this.repository.update(savedStats);
    } else {
      stats = await this.repository.create(realTimeStats);
    }

    return stats;
  }

  async syncAllStats(feeds: RssFeed[]): Promise<RssFeedStats[]> {
    const syncPromises = feeds.map(async (feed) => {
      return this.syncStats(feed.id);
    });

    const syncedStats = await Promise.all(syncPromises);
    return syncedStats.filter((stats): stats is RssFeedStats => stats !== null);
  }
}
