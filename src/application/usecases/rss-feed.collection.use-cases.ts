// src/application/usecases/rss-feed.collection.use-cases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RssFeedCollection } from '../../domain/entities/rss-feed.collection';
import { IRepository } from '../../domain/interfaces/repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import {
  CreateRssFeedCollectionDto,
  UpdateRssFeedCollectionDto,
} from '../dtos/rss-feed.collection.dto';

@Injectable()
export class RssFeedCollectionUseCases
  implements
    IUsecase<
      RssFeedCollection,
      CreateRssFeedCollectionDto,
      UpdateRssFeedCollectionDto
    >
{
  constructor(
    @Inject('IRepository<RssFeedCollection>')
    private readonly repository: IRepository<RssFeedCollection>,
  ) {}

  async getAll(): Promise<RssFeedCollection[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<RssFeedCollection> {
    const collection = await this.repository.getOneById(id);
    if (!collection) {
      throw new HttpException(
        'RSS Feed Collection not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return collection;
  }

  async create(
    collectionDto: CreateRssFeedCollectionDto,
  ): Promise<RssFeedCollection> {
    const collection = new RssFeedCollection(
      undefined,
      collectionDto.name,
      collectionDto.description,
    );

    return await this.repository.create(collection);
  }

  async update(
    id: number,
    collectionDto: UpdateRssFeedCollectionDto,
  ): Promise<RssFeedCollection> {
    const { name, description } = collectionDto;
    const collection = await this.getOneById(id);

    if (undefined !== name) {
      collection.name = name;
    }

    if (undefined !== description && null !== description) {
      collection.description = description;
    }

    const updatedCollection = await this.repository.update(collection);
    if (!updatedCollection) {
      throw new HttpException(
        `Failed to update RSS Feed with ID ${id}. It may not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedCollection;
  }

  async delete(id: number): Promise<void> {
    const collection = await this.getOneById(id);

    await this.repository.delete(collection.id);
  }
}
