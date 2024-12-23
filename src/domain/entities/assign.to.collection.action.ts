// src/domain/entities/assign.to.collection.action.ts

import { ActionType } from '../enums/action.type';

import { IBaseAction } from './Action';
import { ArticleCollection } from './article.collection';

export class AssignToCollectionAction implements IBaseAction {
  constructor(
    public id: number | undefined,
    public name: string,
    public type: ActionType.ASSIGN_TO_COLLECTION,
    public parameters: {
      collection: ArticleCollection | undefined;
    },
  ) {}
}
