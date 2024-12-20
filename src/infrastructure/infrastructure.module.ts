import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestLoggerAdapter } from './adapters/nest-logger.adapter';
import {
  ArticleCollectionEntity,
  ArticleEntity,
  RssFeedCollectionEntity,
  RssFeedEntity,
} from './entities';
import { ArticleCollectionRepository } from './repositories/article.collection.repository';
import { ArticleRepository } from './repositories/article.repository';
import { RssFeedCollectionRepository } from './repositories/rss-feed.collection.repository';
import { RssFeedRepository } from './repositories/rss-feed.repository';
import { RssParserService } from './services/rss-parser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      RssFeedEntity,
      RssFeedCollectionEntity,
      ArticleCollectionEntity,
    ]),
  ],
  providers: [
    {
      provide: 'IRssParser',
      useClass: RssParserService,
    },
    {
      provide: 'ILogger',
      useClass: NestLoggerAdapter,
    },
    {
      provide: 'IRepository<Article>',
      useClass: ArticleRepository,
    },
    {
      provide: 'IRepository<ArticleCollection>',
      useClass: ArticleCollectionRepository,
    },
    {
      provide: 'IRepository<RssFeed>',
      useClass: RssFeedRepository,
    },
    {
      provide: 'IRepository<RssFeedCollection>',
      useClass: RssFeedCollectionRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IRssParser',
    'ILogger',
    'IRepository<Article>',
    'IRepository<RssFeed>',
    'IRepository<RssFeedCollection>',
    'IRepository<ArticleCollection>',
  ],
})
export class InfrastructureModule {}
