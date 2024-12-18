// src/domain/entities/RssFeedCollection.ts
import { IBaseCollection } from '../interfaces/base.collection';

import { RssFeed } from './rss-feed';

export class RssFeedCollection implements IBaseCollection {
  constructor(
    public id: number | undefined,
    public name: string,
    public description?: string,
    public feeds?: RssFeed[],
  ) {}
}
