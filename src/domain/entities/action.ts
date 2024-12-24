// src/domain/entities/action.ts

import { ActionType } from '../enums/action.type';
import { IEntity } from '../interfaces/entity';

import { AssignToCollectionAction } from './assign.to.collection.action';

export interface IBaseAction extends IEntity {
  id: number | undefined;
  name: string;
  type: ActionType;
}

export type Action = AssignToCollectionAction;
