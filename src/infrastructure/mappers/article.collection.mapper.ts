// src/infrastructure/mappers/article.collection.mapper.ts

import { ArticleCollection } from '../../domain/entities/article.collection';
import { ArticleCollectionEntity } from '../entities';

import { ArticleMapper } from './article.mapper';

export class ArticleCollectionMapper {
  static toDomain(entity: ArticleCollectionEntity): ArticleCollection {
    const articles = entity.articles?.map((article) =>
      ArticleMapper.toPartialDomain(article),
    );

    const domain = this.toPartialDomain(entity);
    domain.description = entity.description;
    domain.articles = articles;

    return domain;
  }

  static toPartialDomain(entity: ArticleCollectionEntity): ArticleCollection {
    return new ArticleCollection(entity.id, entity.name);
  }

  static toEntity(domain: ArticleCollection): ArticleCollectionEntity {
    const entity = this.toPartialEntity(domain);

    entity.description = domain.description;

    entity.articles = domain.articles?.map((article) =>
      ArticleMapper.toPartialEntity(article),
    );

    return entity;
  }

  static toPartialEntity(domain: ArticleCollection): ArticleCollectionEntity {
    const entity = new ArticleCollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;

    return entity;
  }
}
