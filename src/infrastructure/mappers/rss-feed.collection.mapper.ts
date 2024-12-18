// src/infrastructure/mappers/RSSFeedCollectionMapper.ts

import { RssFeedCollection } from '../../domain/entities/rss-feed.collection';
import { RssFeedCollectionEntity } from '../entities';

import { RssFeedMapper } from './rss-feed.mapper';

export class RssFeedCollectionMapper {
  static toDomain(entity: RssFeedCollectionEntity): RssFeedCollection {
    const feeds = entity.feeds?.map((feed) =>
      RssFeedMapper.toPartialDomain(feed),
    );

    const domain = this.toPartialDomain(entity);
    domain.description = entity.description;
    domain.feeds = feeds;

    return domain;
  }

  static toPartialDomain(entity: RssFeedCollectionEntity): RssFeedCollection {
    return new RssFeedCollection(entity.id, entity.name);
  }

  static toEntity(domain: RssFeedCollection): RssFeedCollectionEntity {
    const entity = this.toPartialEntity(domain);

    entity.description = domain.description;

    entity.feeds = domain.feeds?.map((feed) =>
      RssFeedMapper.toPartialEntity(feed),
    );

    return entity;
  }

  static toPartialEntity(domain: RssFeedCollection): RssFeedCollectionEntity {
    const entity = new RssFeedCollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;

    return entity;
  }
}
