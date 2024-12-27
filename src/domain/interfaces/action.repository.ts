// /src/domain/interfaces/action.repository.ts

import { Action } from '../entities/action';

import { IRepository } from './repository';

export interface IActionRepository extends IRepository<Action> {
  findActionExistForCollection(collectionId: number): Promise<Action | null>;

  findActionWithAgentAndCollectionExist(
    agentId: number,
    collectionId: number,
  ): Promise<Action | null>;
}
