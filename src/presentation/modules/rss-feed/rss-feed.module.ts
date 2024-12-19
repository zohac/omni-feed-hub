import { Module } from '@nestjs/common';

import { ParseFeedUseCase } from '../../../application/usecases/parse.feed.use-case';
import { RssFeedCollectionUseCases } from '../../../application/usecases/rss-feed.collection.use-cases';
import { RssFeedUseCases } from '../../../application/usecases/rss-feed.use-cases';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

import { RssFeedController } from './rss-feed.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [RssFeedController],
  providers: [RssFeedUseCases, ParseFeedUseCase, RssFeedCollectionUseCases],
})
export class RssFeedModule {}
