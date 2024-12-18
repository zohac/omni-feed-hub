import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RssFeedCollectionUseCases } from '../../../application/usecases/rss-feed.collection.use-cases';
import { RssFeedUseCases } from '../../../application/usecases/rss-feed.use-cases';
import { RssFeedEntity } from '../../../infrastructure/entities';
import { RssFeedCollectionRepository } from '../../../infrastructure/repositories/rss-feed.collection.repository';
import { RssFeedRepository } from '../../../infrastructure/repositories/rss-feed.repository';
import { RssFeedCollectionModule } from '../rss-feed-collection/rss-feed.collection.module';

import { RssFeedController } from './rss-feed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RssFeedEntity]), RssFeedCollectionModule],
  controllers: [RssFeedController],
  providers: [
    {
      provide: 'IRepository<RssFeed>',
      useClass: RssFeedRepository,
    },
    {
      provide: 'IRepository<RssFeedCollection>',
      useClass: RssFeedCollectionRepository,
    },
    RssFeedUseCases,
    RssFeedCollectionUseCases,
  ],
  exports: [TypeOrmModule],
})
export class RssFeedModule {}
