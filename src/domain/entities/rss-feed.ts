// src/domain/entities/RSSFeed.ts
import { IEntity } from '../interfaces/entity';

import { RssFeedCollection } from './rss-feed.collection';

export class RssFeed implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public url: string,
    public description?: string,
    public collection?: RssFeedCollection,
  ) {}
}
