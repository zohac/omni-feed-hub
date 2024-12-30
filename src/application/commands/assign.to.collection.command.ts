// src/application/commands/assign.ti.collection.command.ts

import { Injectable } from '@nestjs/common';

import { ITaskCommand } from '../../domain/interfaces/task.command';
import { ArticleUseCases } from '../usecases/article.use-cases';

@Injectable()
export class AssignToCollectionCommand implements ITaskCommand {
  constructor(
    private readonly articleId: number,
    private readonly collectionId: number,
    private readonly articleUseCase: ArticleUseCases,
  ) {}

  async execute(): Promise<void> {
    await this.articleUseCase.assignToCollection(
      this.articleId,
      this.collectionId,
    );
  }
}
