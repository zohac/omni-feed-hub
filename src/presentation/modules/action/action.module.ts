import { Module } from '@nestjs/common';

import { ActionDtoFactory } from '../../../application/factories/action.dto.factory';
import { ActionUseCases } from '../../../application/usecases/action.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';
import { ArticleCollectionModule } from '../article-collection/article.collection.module';

import { ActionController } from './action.controller';

@Module({
  imports: [InfrastructureModule, ArticleCollectionModule],
  controllers: [ActionController],
  providers: [ActionUseCases, ActionDtoFactory],
  exports: [ActionUseCases],
})
export class ActionModule {}
