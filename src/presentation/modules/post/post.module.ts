// src/presentation/modules/post/post.module.ts

import { Module } from '@nestjs/common';

import { PostUseCases } from 'src/application/usecases/post.use-cases';

import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';
import { ArticleModule } from '../article/article.module';

import { PostController } from './post.controller';

@Module({
  imports: [InfrastructureModule, ArticleModule],
  controllers: [PostController],
  providers: [PostUseCases],
  exports: [PostUseCases],
})
export class PostModule {}
