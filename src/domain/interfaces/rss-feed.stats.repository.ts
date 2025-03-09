import { RssFeedStats } from '../entities/rss-feed.stats';

import { IRepository } from './repository';

export interface IRssFeedStatsRepository extends IRepository<RssFeedStats> {
  getRealStatsByFeedId(feedId: number): Promise<RssFeedStats | null>;

  getAllRealStats(): Promise<RssFeedStats[]>;

  getStatsFromFeedId(feedId: number): Promise<RssFeedStats | null>;
}
