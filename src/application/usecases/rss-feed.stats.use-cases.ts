// src/application/usecases/rss-feed.stats.use-cases.ts

import { Inject } from '@nestjs/common';

import { RssFeedStats } from '../../domain/entities/rss-feed.stats';
import { IRssFeedStatsRepository } from '../../domain/interfaces/rss-feed.stats.repository';

import { RssFeedUseCases } from './rss-feed.use-cases';

export class RssFeedStatsUseCases {
  constructor(
    @Inject('IRepository<RssFeedStats>')
    private readonly repository: IRssFeedStatsRepository,
    private readonly feedUseCases: RssFeedUseCases,
  ) {}

  async getAll(): Promise<RssFeedStats[]> {
    let stats = await this.repository.getAll();
    if (0 === stats.length) {
      stats = await this.syncAllStats();
    }

    return stats;
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

  async syncAllStats(): Promise<RssFeedStats[]> {
    const feeds = await this.feedUseCases.getAll();
    const syncPromises = feeds.map(async (feed) => {
      return this.syncStats(feed.id);
    });

    const syncedStats = await Promise.all(syncPromises);
    return syncedStats.filter((stats): stats is RssFeedStats => stats !== null);
  }
}
