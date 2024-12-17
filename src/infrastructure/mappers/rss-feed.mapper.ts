// src/infrastructure/mappers/RssFeedMapper.ts

import { RssFeed } from '../../domain/entities/rss-feed';
import { RssFeedEntity } from '../entities';

export class RssFeedMapper {
  static toDomain(entity: RssFeedEntity): RssFeed {
    const domain = this.toPartialDomain(entity);

    domain.description = entity.description;

    return domain;
  }

  static toPartialDomain(entity: RssFeedEntity): RssFeed {
    return new RssFeed(entity.id, entity.title, entity.url);
  }

  static toEntity(domain: RssFeed): RssFeedEntity {
    const entity = this.toPartialEntity(domain);

    return entity;
  }

  static toPartialEntity(domain: RssFeed): RssFeedEntity {
    const entity = new RssFeedEntity();
    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.url = domain.url;
    entity.description = domain.description;

    return entity;
  }
}
