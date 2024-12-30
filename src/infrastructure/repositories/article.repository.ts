// src/infrastructure/repositories/article.analysis.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { Article } from '../../domain/entities/Article';
import { ArticleSourceType } from '../../domain/enums/article.source.type';
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
      relations: ['feed'],
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Article | null> {
    const entity = await this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.feed', 'feed')
      .where('article.id = :id', { id })
      .getOne();

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
      relations: ['feed'],
    });
    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
  }

  async getUnanalyzedArticlesByAgent(agentId: number): Promise<Article[]> {
    const entities = await this.repository
      .createQueryBuilder('a')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(ArticleAnalysisEntity, 'aa')
          .where('aa.articleId = a.id')
          .andWhere('aa.agentId = :agentId', { agentId })
          .andWhere('aa.status IN (:...statuses)', {
            statuses: ['completed'],
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
    await this.repository.delete({
      publicationAt: LessThan(olderThan),
      sourceType: ArticleSourceType.RSS,
      isSaved: false,
    });
  }
}
