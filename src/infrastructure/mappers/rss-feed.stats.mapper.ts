// src/infrastructure/mappers/rss-feed.stats.mapper.ts

import { RssFeedStats } from '../../domain/entities/rss-feed.stats';
import { RssFeedStatsEntity } from '../entities';

import { RssFeedMapper } from './rss-feed.mapper';

export class RssFeedStatsMapper {
  static toDomain(entity: RssFeedStatsEntity): RssFeedStats {
    const domain = this.toPartialDomain(entity);

    return domain;
  }

  static toPartialDomain(entity: RssFeedStatsEntity): RssFeedStats {
    return new RssFeedStats(
      entity.id,
      RssFeedMapper.toPartialDomain(entity.feed),
      entity.totalArticles,
      entity.unreadArticles,
      entity.favoriteArticles,
      entity.archivedArticles,
      entity.savedArticles,
    );
  }

  static toEntity(domain: RssFeedStats): RssFeedStatsEntity {
    const entity = this.toPartialEntity(domain);

    return entity;
  }

  static toPartialEntity(domain: RssFeedStats): RssFeedStatsEntity {
    const entity = new RssFeedStatsEntity();
    if (domain.id !== undefined) entity.id = domain.id;
    entity.feed = RssFeedMapper.toPartialEntity(domain.feed);
    entity.totalArticles = domain.totalArticles;
    entity.unreadArticles = domain.unreadArticles;
    entity.favoriteArticles = domain.favoriteArticles;
    entity.archivedArticles = domain.archivedArticles;
    entity.savedArticles = domain.savedArticles;

    return entity;
  }
}
