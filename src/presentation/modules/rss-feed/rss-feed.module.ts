import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RssFeedUseCases } from '../../../application/usecases/rss-feed.usecases';
import { RssFeedEntity } from '../../../infrastructure/entities';
import { RssFeedRepository } from '../../../infrastructure/repositories/rss-feed.repository';

import { RssFeedController } from './rss-feed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RssFeedEntity])],
  controllers: [RssFeedController],
  providers: [
    {
      provide: 'IRepository<RssFeed>',
      useClass: RssFeedRepository,
    },
    RssFeedUseCases,
  ],
  exports: [TypeOrmModule],
})
export class RssFeedModule {}
