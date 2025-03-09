// src/domain/entities/rss-feed.stats.ts

import { IEntity } from '../interfaces/entity';

import { RssFeed } from './rss-feed';

export class RssFeedStats implements IEntity {
  constructor(
    public id: number | undefined,
    public feed: RssFeed,
    public totalArticles: number,
    public unreadArticles: number,
    public favoriteArticles: number,
    public archivedArticles: number,
    public savedArticles: number,
  ) {}
}
