// src/infrastructure/articleRepositorysitories/ArticleRepository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { Article } from '../../domain/entities/Article';
import { ActionType } from '../../domain/enums/action.type';
import { ArticleSourceType } from '../../domain/enums/article.source.type';
import { TaskStatus } from '../../domain/enums/task.status';
import { IArticleRepository } from '../../domain/interfaces/article.repository';
import { ArticleEntity, TaskEntity } from '../entities';
import { ArticleMapper } from '../mappers/article.mapper';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(article: Article): Promise<Article> {
    const articleEntity = ArticleMapper.toEntity(article);
    const entity = this.articleRepository.create(articleEntity);
    const result = await this.articleRepository.save(entity);

    return ArticleMapper.toDomain(result);
  }

  async getAll(): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      relations: ['feed'],
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Article | null> {
    const entity = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.feed', 'feed')
      .where('article.id = :id', { id })
      .getOne();

    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
  }

  async getArticlesByFeedId(feedId: number): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      where: { feed: { id: feedId } },
      relations: ['feed'],
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getOneByLink(link: string): Promise<Article | null> {
    const entity = await this.articleRepository.findOne({
      where: { link },
      relations: ['feed'],
    });
    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
  }

  async getUnanalyzedArticlesByAgent(agentId: number): Promise<Article[]> {
    const entities = await this.articleRepository
      .createQueryBuilder()
      .select('article')
      .from(ArticleEntity, 'article')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('task.articleId')
          .from(TaskEntity, 'task')
          .where('task.assignedAgentId = :agentId', { agentId })
          .andWhere('task.type = :type', {
            type: ActionType.ASSIGN_TO_COLLECTION,
          })
          .andWhere('task.status = :status', { status: TaskStatus.COMPLETED })
          .getQuery();

        return `article.id NOT IN ${subQuery}`;
      })
      .getMany();

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async update(article: Article): Promise<Article | null> {
    const articleEntity = ArticleMapper.toEntity(article);

    await this.articleRepository.save(articleEntity);

    return await this.getOneById(articleEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.articleRepository.delete({ id });
  }

  async deleteOldRSSArticles(olderThan: Date): Promise<void> {
    await this.articleRepository.delete({
      publicationAt: LessThan(olderThan),
      sourceType: ArticleSourceType.RSS,
      isSaved: false,
    });
  }
}
