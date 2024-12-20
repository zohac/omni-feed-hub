import { Module } from '@nestjs/common';

import { ArticleUseCases } from '../../../application/usecases/article.use-cases';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

import { ArticleController } from './article.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [ArticleController],
  providers: [ArticleUseCases],
})
export class ArticleModule {}
