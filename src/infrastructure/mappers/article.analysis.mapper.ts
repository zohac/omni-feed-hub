// src/infrastructure/mappers/article.collection.mapper.ts

import { ArticleAnalysis } from '../../domain/entities/article.analyse';
import { ArticleAnalysisEntity } from '../entities';

import { ArticleMapper } from './article.mapper';

export class ArticleAnalysisMapper {
  static toDomain(entity: ArticleAnalysisEntity): ArticleAnalysis {
    return this.toPartialDomain(entity);
  }

  static toPartialDomain(entity: ArticleAnalysisEntity): ArticleAnalysis {
    return new ArticleAnalysis(
      entity.id,
      ArticleMapper.toPartialDomain(entity.article),
      entity.agent,
      entity.status,
      entity.createdAt,
    );
  }

  static toEntity(domain: ArticleAnalysis): ArticleAnalysisEntity {
    return this.toPartialEntity(domain);
  }

  static toPartialEntity(domain: ArticleAnalysis): ArticleAnalysisEntity {
    const entity = new ArticleAnalysisEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.article = ArticleMapper.toPartialEntity(domain.article);
    entity.agent = domain.agent;
    entity.status = domain.status;
    entity.result = domain.result;
    entity.createdAt = domain.createdAt;
    entity.result = domain.result;

    return entity;
  }
}
