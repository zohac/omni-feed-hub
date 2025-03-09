// src/infrastructure/repositories/rss-feed.stats.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RssFeedStats } from '../../domain/entities/rss-feed.stats';
import { IRssFeedStatsRepository } from '../../domain/interfaces/rss-feed.stats.repository';
import { ArticleEntity, RssFeedEntity, RssFeedStatsEntity } from '../entities';
import { RssFeedStatsMapper } from '../mappers/rss-feed.stats.mapper';

@Injectable()
export class RssFeedStatsRepository implements IRssFeedStatsRepository {
  constructor(
    @InjectRepository(RssFeedStatsEntity)
    private readonly repository: Repository<RssFeedStatsEntity>,
    @InjectRepository(RssFeedEntity)
    private readonly rssFeedRepository: Repository<RssFeedEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async getOneById(id: number): Promise<RssFeedStats | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['feed'],
    });
    if (!entity) return null;

    return RssFeedStatsMapper.toDomain(entity);
  }

  async getAll(): Promise<RssFeedStats[]> {
    const entities = await this.repository.find({
      relations: ['feed'],
    });

    return entities.map((entity) => RssFeedStatsMapper.toDomain(entity));
  }

  async create(stats: RssFeedStats): Promise<RssFeedStats> {
    const statsEntity = RssFeedStatsMapper.toEntity(stats);

    const entity = this.repository.create(statsEntity);
    const result = await this.repository.save(entity);

    return RssFeedStatsMapper.toDomain(result);
  }

  async update(stats: RssFeedStats): Promise<RssFeedStats | null> {
    const statsEntity = RssFeedStatsMapper.toEntity(stats);

    await this.repository.update(statsEntity.id, statsEntity);

    return await this.getOneById(statsEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getRealStatsByFeedId(feedId: number): Promise<RssFeedStats | null> {
    const feed = await this.rssFeedRepository.findOne({
      where: { id: feedId },
    });
    if (!feed) return null;

    const totalArticles = await this.articleRepository.count({
      where: { feed: { id: feedId } },
    });
    const unreadArticles = await this.articleRepository.count({
      where: { feed: { id: feedId }, isRead: false },
    });
    const favoriteArticles = await this.articleRepository.count({
      where: { feed: { id: feedId }, isFavorite: true },
    });
    const archivedArticles = await this.articleRepository.count({
      where: { feed: { id: feedId }, isArchived: true },
    });
    const savedArticles = await this.articleRepository.count({
      where: { feed: { id: feedId }, isSaved: true },
    });

    const statsEntity = new RssFeedStatsEntity();
    statsEntity.feed = feed;
    statsEntity.totalArticles = totalArticles;
    statsEntity.unreadArticles = unreadArticles;
    statsEntity.favoriteArticles = favoriteArticles;
    statsEntity.archivedArticles = archivedArticles;
    statsEntity.savedArticles = savedArticles;

    return RssFeedStatsMapper.toDomain(statsEntity);
  }

  async getAllRealStats(): Promise<RssFeedStats[]> {
    const feeds = await this.rssFeedRepository.find();

    const statsPromises = feeds.map(async (feed) => {
      return this.getRealStatsByFeedId(feed.id);
    });

    const statsEntities = await Promise.all(statsPromises);
    return statsEntities.filter(
      (stats): stats is RssFeedStats => stats !== null,
    );
  }

  async getStatsFromFeedId(feedId: number): Promise<RssFeedStats | null> {
    const entity = await this.repository.findOne({
      where: { feed: { id: feedId } },
      relations: ['feed'],
    });
    if (!entity) return null;

    return RssFeedStatsMapper.toDomain(entity);
  }
}
