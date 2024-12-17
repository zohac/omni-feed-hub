// src/domain/entities/RSSFeed.ts
import { IEntity } from '../interfaces/entity';

export class RssFeed implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public url: string,
    public description?: string,
  ) {}
}
