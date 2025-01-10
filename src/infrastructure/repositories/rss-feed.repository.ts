import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RssFeed } from '../../domain/entities/rss-feed';
import { IRepository } from '../../domain/interfaces/repository';
import { RssFeedEntity } from '../entities';
import { RssFeedMapper } from '../mappers/rss-feed.mapper';

@Injectable()
export class RssFeedRepository implements IRepository<RssFeed> {
  constructor(
    @InjectRepository(RssFeedEntity)
    private readonly repository: Repository<RssFeedEntity>,
  ) {}

  async getOneById(id: number): Promise<RssFeed | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['collection', 'articles'],
    });
    if (!entity) return null;

    return RssFeedMapper.toDomain(entity);
  }

  async getAll(): Promise<RssFeed[]> {
    const entities = await this.repository.find({
      relations: ['collection'],
    });
    return entities.map((entity) => RssFeedMapper.toDomain(entity));
  }

  async create(feed: RssFeed): Promise<RssFeed> {
    const rssFeedEntity = RssFeedMapper.toEntity(feed);

    const entity = this.repository.create(rssFeedEntity);
    const result = await this.repository.save(entity);

    return RssFeedMapper.toDomain(result);
  }

  async update(feed: RssFeed): Promise<RssFeed | null> {
    const rssFeedEntity = RssFeedMapper.toEntity(feed);

    await this.repository.update(rssFeedEntity.id, rssFeedEntity);

    return await this.getOneById(rssFeedEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
