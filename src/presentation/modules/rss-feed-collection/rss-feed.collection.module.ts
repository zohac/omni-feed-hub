import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RssFeedCollectionUseCases } from '../../../application/usecases/rss-feed.collection.use-cases';
import { RssFeedCollectionEntity } from '../../../infrastructure/entities';
import { RssFeedCollectionRepository } from '../../../infrastructure/repositories/rss-feed.collection.repository';

import { RssFeedCollectionController } from './rss-feed.collection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RssFeedCollectionEntity])],
  controllers: [RssFeedCollectionController],
  providers: [
    {
      provide: 'IRepository<RssFeedCollection>',
      useClass: RssFeedCollectionRepository,
    },
    RssFeedCollectionUseCases,
  ],
  exports: [TypeOrmModule],
})
export class RssFeedCollectionModule {}
