// src/infrastructure/repositories/article.analysis.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleFilterDto } from '../../application/dtos/article.filter.dto';
import { Article } from '../../domain/entities/article';
import { ArticleAnalysisStatus } from '../../domain/enums/article.analysis.status';
import { IArticleRepository } from '../../domain/interfaces/article.repository';
import { ArticleAnalysisEntity, ArticleEntity } from '../entities';
import { ArticleMapper } from '../mappers/article.mapper';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {}

  async create(article: Article): Promise<Article> {
    const articleEntity = ArticleMapper.toEntity(article);
    const entity = this.repository.create(articleEntity);
    const result = await this.repository.save(entity);

    return ArticleMapper.toDomain(result);
  }

  async getAll(): Promise<Article[]> {
    const entities = await this.repository.find({
      relations: ['feed', 'collection'],
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Article | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['feed', 'collection', 'mediaAttachments'],
    });

    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
  }

  async getArticlesByFeedId(feedId: number): Promise<Article[]> {
    const entities = await this.repository.find({
      where: { feed: { id: feedId } },
      relations: ['feed'],
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getOneByLink(link: string): Promise<Article | null> {
    const entity = await this.repository.findOne({
      where: { link },
      relations: ['feed', 'mediaAttachments'],
    });
    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
  }

  async getUnanalyzedArticlesByAgent(agentName: string): Promise<Article[]> {
    const entities = await this.repository
      .createQueryBuilder('a')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(ArticleAnalysisEntity, 'aa')
          .where('aa.articleId = a.id')
          .andWhere('aa.agent = :agent', { agent: agentName })
          .andWhere('aa.status IN (:...statuses)', {
            statuses: [
              ArticleAnalysisStatus.COMPLETED,
              ArticleAnalysisStatus.PENDING,
            ],
          })
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      })
      .getMany();

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async update(article: Article): Promise<Article | null> {
    const articleEntity = ArticleMapper.toEntity(article);

    await this.repository.save(articleEntity);

    return await this.getOneById(articleEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async deleteOldRSSArticles(olderThan: Date): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(ArticleEntity)
      .where('publicationAt < :olderThan', { olderThan })
      .andWhere('isSaved = :isSaved', { isSaved: false })
      .andWhere('isArchived = :isArchived', { isArchived: false })
      .andWhere('isFavorite = :isFavorite', { isFavorite: false })
      .execute();
  }

  async getByTag(params: ArticleFilterDto): Promise<Article[]> {
    const { tag, limit, sortPublicationAt } = params;

    const qb = this.repository
      .createQueryBuilder('a')
      .where('a.tags @> :tag', { tag: JSON.stringify([tag]) })
      .andWhere('a.post IS NULL');

    // Optionnel: Gestion du tri
    // On trie par date de création (createdAt) si sortDirection est fourni
    if (sortPublicationAt) {
      qb.orderBy('a.publicationAt', sortPublicationAt);
    }

    // Optionnel: Limiter le nombre de résultats
    if (limit) {
      qb.take(limit);
    }

    const entities = await qb.getMany();
    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getUnanalyzedArticlesByAgentWithTag(
    agentName: string,
    tag: string,
  ): Promise<Article[]> {
    const entities = await this.repository
      .createQueryBuilder('a')
      .where(`a.tags @> :tag`, { tag: JSON.stringify([tag]) })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(ArticleAnalysisEntity, 'aa')
          .where('aa.articleId = a.id')
          .andWhere('aa.agent = :agent', { agent: agentName })
          .andWhere('aa.status IN (:...statuses)', {
            statuses: [
              ArticleAnalysisStatus.COMPLETED,
              ArticleAnalysisStatus.PENDING,
            ],
          })
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      })
      .getMany();

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getArticlesWithVideoTagToTranscript(): Promise<Article[]> {
    const entities = await this.repository
      .createQueryBuilder('a')
      .where('a.tags @> :tag', { tag: JSON.stringify(['to-transcript']) })

      .getMany();

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }
}
