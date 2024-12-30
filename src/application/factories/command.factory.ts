// src/application/factories/command.factory.ts

import { Injectable } from '@nestjs/common';

import { AssignToCollectionCommand } from '../commands/assign.to.collection.command';
import { ArticleUseCases } from '../usecases/article.use-cases';

@Injectable()
export class CommandFactory {
  constructor(private readonly articleUseCase: ArticleUseCases) {}

  createAssignToCollectionCommand(
    articleId: number,
    collectionId: number,
  ): AssignToCollectionCommand {
    return new AssignToCollectionCommand(
      articleId,
      collectionId,
      this.articleUseCase,
    );
  }
}
