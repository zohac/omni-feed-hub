import { Module } from '@nestjs/common';

import { ArticleCollectionUseCases } from '../../../application/usecases/article.collection.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';

import { ArticleCollectionController } from './article.collection.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [ArticleCollectionController],
  providers: [ArticleCollectionUseCases],
  exports: [ArticleCollectionUseCases],
})
export class ArticleCollectionModule {}
