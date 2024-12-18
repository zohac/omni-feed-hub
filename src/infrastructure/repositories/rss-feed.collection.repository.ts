// src/infrastructure/Repositories/RSSFeedCollectionRepository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RssFeedCollection } from '../../domain/entities/rss-feed.collection';
import { IRepository } from '../../domain/interfaces/repository';
import { RssFeedCollectionEntity } from '../entities';
import { RssFeedCollectionMapper } from '../mappers/rss-feed.collection.mapper';

@Injectable()
export class RssFeedCollectionRepository
  implements IRepository<RssFeedCollection>
{
  constructor(
    @InjectRepository(RssFeedCollectionEntity)
    private readonly repository: Repository<RssFeedCollectionEntity>,
  ) {}

  async getAll(): Promise<RssFeedCollection[]> {
    const entities = await this.repository.find({
      relations: ['feeds'],
    });
    return entities.map((entity) => RssFeedCollectionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<RssFeedCollection | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['feeds'],
    });
    if (!entity) return null;

    return RssFeedCollectionMapper.toDomain(entity);
  }

  async create(collection: RssFeedCollection): Promise<RssFeedCollection> {
    const collectionEntity = RssFeedCollectionMapper.toEntity(collection);
    const entity = this.repository.create(collectionEntity);
    const result = await this.repository.save(entity);

    return RssFeedCollectionMapper.toDomain(result);
  }

  async update(
    collection: RssFeedCollection,
  ): Promise<RssFeedCollection | null> {
    const collectionEntity = RssFeedCollectionMapper.toEntity(collection);
    await this.repository.save(collectionEntity);

    return await this.getOneById(collectionEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
