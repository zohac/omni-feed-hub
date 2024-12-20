// src/infrastructure/Repositories/RSSFeedCollectionRepository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleCollection } from '../../domain/entities/article.collection';
import { RssFeedCollection } from '../../domain/entities/rss-feed.collection';
import { IRepository } from '../../domain/interfaces/repository';
import { ArticleCollectionEntity } from '../entities';
import { ArticleCollectionMapper } from '../mappers/article.collection.mapper';

@Injectable()
export class ArticleCollectionRepository
  implements IRepository<ArticleCollection>
{
  constructor(
    @InjectRepository(ArticleCollectionEntity)
    private readonly repository: Repository<ArticleCollectionEntity>,
  ) {}

  async getAll(): Promise<RssFeedCollection[]> {
    const entities = await this.repository.find({
      relations: ['articles'],
    });
    return entities.map((entity) => ArticleCollectionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<RssFeedCollection | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['articles'],
    });
    if (!entity) return null;

    return ArticleCollectionMapper.toDomain(entity);
  }

  async create(collection: RssFeedCollection): Promise<RssFeedCollection> {
    const collectionEntity = ArticleCollectionMapper.toEntity(collection);
    const entity = this.repository.create(collectionEntity);
    const result = await this.repository.save(entity);

    return ArticleCollectionMapper.toDomain(result);
  }

  async update(
    collection: RssFeedCollection,
  ): Promise<RssFeedCollection | null> {
    const collectionEntity = ArticleCollectionMapper.toEntity(collection);
    await this.repository.save(collectionEntity);

    return await this.getOneById(collectionEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
