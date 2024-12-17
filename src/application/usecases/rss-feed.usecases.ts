// src/application/usecases/rss-feed.usecases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RssFeed } from '../../domain/entities/rss-feed';
import { IRepository } from '../../domain/interfaces/repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import { CreateRssFeedDto, UpdateRssFeedDto } from '../dtos/rss-feed.dto';

@Injectable()
export class RssFeedUseCases
  implements IUsecase<RssFeed, CreateRssFeedDto, UpdateRssFeedDto>
{
  constructor(
    @Inject('IRepository<RssFeed>')
    private readonly repository: IRepository<RssFeed>,
  ) {}

  async getAll(): Promise<RssFeed[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<RssFeed | null> {
    const feed = await this.repository.getOneById(id);
    if (!feed) {
      throw new HttpException('Feed not found.', HttpStatus.NOT_FOUND);
    }

    return feed;
  }

  async create(feedDto: CreateRssFeedDto): Promise<RssFeed> {
    const { title, url, description } = feedDto;
    const feed = new RssFeed(undefined, title, url, description);

    // if (undefined !== collectionId) {
    //   const collection =
    //     await this.collectionRepository.getOneById(collectionId);
    //
    //   if (null !== collection) {
    //     feed.collection = collection;
    //   }
    // }

    const feedCreated = await this.repository.create(feed);

    // await this.parseFeedUseCase.execute(feedCreated);

    return feedCreated;
  }

  async update(id: number, feedDto: UpdateRssFeedDto): Promise<RssFeed> {
    const { title, url, description } = feedDto;
    const feed = await this.getOneById(id);

    if (undefined !== title && null !== title) {
      feed.title = title;
    }

    if (undefined !== url && null !== url) {
      feed.url = url;
    }

    if (undefined !== description) {
      feed.description = description;
    }

    // if (undefined === collectionId) {
    //   feed.collection = undefined;
    // } else {
    //   const collection =
    //     await this.collectionRepository.getOneById(collectionId);
    //
    //   if (null === collection) {
    //     const errorMessage = `La collection avec l'id : ${collectionId} n'existe pas`;
    //     logger.error(errorMessage);
    //     throw new Error(errorMessage);
    //   }
    //
    //   feed.collection = collection;
    // }

    return await this.repository.update(feed);
  }

  async delete(id: number): Promise<void> {
    const feed = await this.getOneById(id);

    await this.repository.delete(feed.id);
  }
}
