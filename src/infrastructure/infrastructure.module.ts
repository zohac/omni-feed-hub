import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestLoggerAdapter } from './adapters/nest-logger.adapter';
import {
  AiAgentEntity,
  ArticleCollectionEntity,
  ArticleEntity,
  RssFeedCollectionEntity,
  RssFeedEntity,
} from './entities';
import { AiAgentRepository } from './repositories/ai-agent.repository';
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
      AiAgentEntity,
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
    {
      provide: 'IRepository<AiAgent>',
      useClass: AiAgentRepository,
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
    'IRepository<AiAgent>',
  ],
})
export class InfrastructureModule {}
