import { Module } from '@nestjs/common';

import { ArticleUseCases } from 'src/application/usecases/article.use-cases';
import { WebScraperUseCase } from 'src/application/usecases/web-scraper.use-cases';
import { InfrastructureModule } from 'src/infrastructure/modules/infrastructure.module';
import { ArticleCollectionModule } from '../article-collection/article.collection.module';

import { ArticleController } from './article.controller';

@Module({
  imports: [InfrastructureModule, ArticleCollectionModule],
  controllers: [ArticleController],
  providers: [ArticleUseCases, WebScraperUseCase],
  exports: [ArticleUseCases],
})
export class ArticleModule {}
