// src/application/usecases/article.collection.use-cases.ts

import { HttpException, HttpStatus, Inject } from '@nestjs/common';

import { ArticleCollection } from '../../domain/entities/article.collection';
import { IRepository } from '../../domain/interfaces/repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import {
  CreateArticleCollectionDto,
  UpdateArticleCollectionDto,
} from '../dtos/article.collection.dto';

export class ArticleCollectionUseCases
  implements
    IUsecase<
      ArticleCollection,
      CreateArticleCollectionDto,
      UpdateArticleCollectionDto
    >
{
  constructor(
    @Inject('IRepository<ArticleCollection>')
    private readonly repository: IRepository<ArticleCollection>,
  ) {}

  async getAll(): Promise<ArticleCollection[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<ArticleCollection | null> {
    const collection = await this.repository.getOneById(id);
    if (!collection) {
      throw new HttpException(
        'Article Collection not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return collection;
  }

  async create(
    collectionDto: CreateArticleCollectionDto,
  ): Promise<ArticleCollection> {
    const collection = new ArticleCollection(
      undefined,
      collectionDto.name,
      collectionDto.description,
    );

    return await this.repository.create(collection);
  }

  async update(
    id: number,
    collectionDto: UpdateArticleCollectionDto,
  ): Promise<ArticleCollection> {
    const { name, description } = collectionDto;
    const collection = await this.getOneById(id);

    if (undefined !== name) {
      collection.name = name;
    }

    if (undefined !== description) {
      collection.description = description;
    }

    return this.repository.update(collection);
  }

  async delete(id: number): Promise<void> {
    const collection = await this.getOneById(id);

    await this.repository.delete(collection.id);
  }
}
