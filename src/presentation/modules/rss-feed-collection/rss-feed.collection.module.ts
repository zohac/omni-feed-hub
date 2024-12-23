import { Module } from '@nestjs/common';

import { RssFeedCollectionUseCases } from '../../../application/usecases/rss-feed.collection.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';

import { RssFeedCollectionController } from './rss-feed.collection.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [RssFeedCollectionController],
  providers: [RssFeedCollectionUseCases],
  exports: [RssFeedCollectionUseCases],
})
export class RssFeedCollectionModule {}
