// src/infrastructure/mappers/article.collection.mapper.ts

import { ArticleAnalysis } from '../../domain/entities/article.analyse';
import { ArticleAnalysisEntity } from '../entities';

import { AiAgentMapper } from './ai-agent.mapper';
import { ArticleMapper } from './article.mapper';

export class ArticleAnalysisMapper {
  static toDomain(entity: ArticleAnalysisEntity): ArticleAnalysis {
    return this.toPartialDomain(entity);
  }

  static toPartialDomain(entity: ArticleAnalysisEntity): ArticleAnalysis {
    return new ArticleAnalysis(
      entity.id,
      ArticleMapper.toPartialDomain(entity.article),
      AiAgentMapper.toDomain(entity.agent),
      entity.status,
      entity.result,
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
    entity.agent = AiAgentMapper.toEntity(domain.agent);
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;

    return entity;
  }
}
