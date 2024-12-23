// src/application/usecases/rss-feed.use-cases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RssFeed } from '../../domain/entities/rss-feed';
import { IRepository } from '../../domain/interfaces/repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import { CreateRssFeedDto, UpdateRssFeedDto } from '../dtos/rss-feed.dto';

import { AnalysisUseCases } from './analysis.use-cases';
import { ParseFeedUseCases } from './parse.feed.use-cases';
import { RssFeedCollectionUseCases } from './rss-feed.collection.use-cases';

@Injectable()
export class RssFeedUseCases
  implements IUsecase<RssFeed, CreateRssFeedDto, UpdateRssFeedDto>
{
  constructor(
    @Inject('IRepository<RssFeed>')
    private readonly repository: IRepository<RssFeed>,
    private readonly collectionUseCases: RssFeedCollectionUseCases,
    private readonly parseFeedUseCase: ParseFeedUseCases,
    private readonly analysisUseCases: AnalysisUseCases,
  ) {}

  async getAll(): Promise<RssFeed[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<RssFeed> {
    const feed = await this.repository.getOneById(id);
    if (!feed) {
      throw new HttpException('Feed not found.', HttpStatus.NOT_FOUND);
    }

    return feed;
  }

  async create(feedDto: CreateRssFeedDto): Promise<RssFeed> {
    const { title, url, description, collectionId } = feedDto;
    const feed = new RssFeed(undefined, title, url, description);

    if (undefined !== collectionId) {
      feed.collection = await this.collectionUseCases.getOneById(collectionId);
    }

    const createdFeed = await this.repository.create(feed);

    await this.parseFeedUseCase.execute(createdFeed);
    await this.analysisUseCases.analysisAll();

    return createdFeed;
  }

  async update(id: number, feedDto: UpdateRssFeedDto): Promise<RssFeed> {
    const { title, url, description, collectionId } = feedDto;
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

    if (undefined === collectionId) {
      feed.collection = undefined;
    } else {
      feed.collection = await this.collectionUseCases.getOneById(collectionId);
    }

    const updatedFeed = await this.repository.update(feed);
    if (!updatedFeed) {
      throw new HttpException(
        `Failed to update RSS Feed with ID ${id}. It may not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedFeed;
  }

  async delete(id: number): Promise<void> {
    const feed = await this.getOneById(id);

    await this.repository.delete(feed.id);
  }
}
