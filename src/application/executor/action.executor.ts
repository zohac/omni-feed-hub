// src/application/executor/ActionExecutor.ts

import { Injectable } from '@nestjs/common';

import { Action } from '../../domain/entities/Action';
import { Article } from '../../domain/entities/Article';
import { AssignToCollectionAction } from '../../domain/entities/assign.to.collection.action';
import { ActionType } from '../../domain/enums/action.type';
import { IActionCommand } from '../../domain/interfaces/action.command';
import { AssignToCollectionCommand } from '../commands/assign.to.collection.command';
import { ArticleUseCases } from '../usecases/article.use-cases';

@Injectable()
export class ActionExecutor {
  constructor(private readonly articleUseCases: ArticleUseCases) {}

  async executeActions(actions: Action[], article: Article): Promise<void> {
    let command: IActionCommand;

    for (const action of actions) {
      if (ActionType.ASSIGN_TO_COLLECTION === action.type) {
        command = await this.getAssignToCollectionCommand(action, article);
      } else {
        throw new Error(`Type d'action inconnu: ${action.type}`);
      }
      await command.execute();
    }
  }

  private async getAssignToCollectionCommand(
    action: AssignToCollectionAction,
    article: Article,
  ): Promise<AssignToCollectionCommand> {
    if (undefined !== action.parameters.collection) {
      return new AssignToCollectionCommand(
        article,
        action.parameters.collection,
        this.articleUseCases,
      );
    }

    throw new Error("Aucune collection n'est assignée à l'action");
  }
}
