// src/application/commands/assign.ti.collection.command.ts

import { Injectable } from '@nestjs/common';

import { Article } from '../../domain/entities/Article';
import { ArticleCollection } from '../../domain/entities/article.collection';
import { IActionCommand } from '../../domain/interfaces/action.command';
import { ArticleUseCases } from '../usecases/article.use-cases';

@Injectable()
export class AssignToCollectionCommand implements IActionCommand {
  constructor(
    private readonly article: Article,
    private readonly collection: ArticleCollection,
    private readonly articleUseCase: ArticleUseCases,
  ) {}

  async execute(): Promise<void> {
    await this.articleUseCase.assignToCollection(this.article, this.collection);
  }
}
