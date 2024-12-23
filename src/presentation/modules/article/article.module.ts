import { Module } from '@nestjs/common';

import { ArticleUseCases } from '../../../application/usecases/article.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';
import { ArticleCollectionModule } from '../article-collection/article.collection.module';

import { ArticleController } from './article.controller';

@Module({
  imports: [InfrastructureModule, ArticleCollectionModule],
  controllers: [ArticleController],
  providers: [ArticleUseCases],
  exports: [ArticleUseCases],
})
export class ArticleModule {}
