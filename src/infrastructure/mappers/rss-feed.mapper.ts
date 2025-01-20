// src/infrastructure/mappers/RssFeedMapper.ts

import { RssFeed } from '../../domain/entities/rss-feed';
import { RssFeedEntity } from '../entities';

import { ArticleMapper } from './article.mapper';
import { RssFeedCollectionMapper } from './rss-feed.collection.mapper';

export class RssFeedMapper {
  static toDomain(entity: RssFeedEntity): RssFeed {
    const domain = this.toPartialDomain(entity);

    domain.description = entity.description;

    if (undefined !== entity.collection && null !== entity.collection) {
      domain.collection = RssFeedCollectionMapper.toPartialDomain(
        entity.collection,
      );
    }

    if (undefined !== entity.articles && null !== entity.articles) {
      domain.articles = entity.articles.map((article) => {
        return ArticleMapper.toDomain(article);
      });
    }

    return domain;
  }

  static toPartialDomain(entity: RssFeedEntity): RssFeed {
    return new RssFeed(entity.id, entity.title, entity.url);
  }

  static toEntity(domain: RssFeed): RssFeedEntity {
    const entity = this.toPartialEntity(domain);

    entity.description = domain.description;

    if (undefined !== domain.collection && null !== domain.collection) {
      entity.collection = RssFeedCollectionMapper.toPartialEntity(
        domain.collection,
      );
    }

    return entity;
  }

  static toPartialEntity(domain: RssFeed): RssFeedEntity {
    const entity = new RssFeedEntity();
    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.url = domain.url;

    return entity;
  }
}
