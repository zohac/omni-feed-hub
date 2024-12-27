// src/application/usecases/assign-actions-to-agent.use-case.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Action } from '../../domain/entities/action';
import { AiAgent } from '../../domain/entities/ai-agent';
import { AssignToCollectionAction } from '../../domain/entities/assign.to.collection.action';
import { ActionType } from '../../domain/enums/action.type';
import { IAiAgentRepository } from '../../domain/interfaces/ai-agent.repository';
import { CreateActionDto } from '../dtos/action.dto';
import { AssignActionsToAgentDto } from '../dtos/assign.action.to.agent.dto';
import { CreateAssignToCollectionActionDto } from '../dtos/assign.to.collection.action.dto';

import { ActionUseCases } from './action.use-cases';
import { AiAgentUseCases } from './ai-agent.use-cases';
import { ArticleCollectionUseCases } from './article.collection.use-cases';

@Injectable()
export class AssignActionsToAgentUseCases {
  constructor(
    @Inject('IRepository<AiAgent>')
    private readonly repository: IAiAgentRepository,
    private readonly agentUseCases: AiAgentUseCases,
    private readonly actionUseCases: ActionUseCases,
    private readonly collectionUseCases: ArticleCollectionUseCases,
  ) {}

  async execute(
    agentId: number,
    dto: AssignActionsToAgentDto,
  ): Promise<AiAgent> {
    const agent = await this.agentUseCases.getOneById(agentId);

    const existingActions = await this.handleExistingActions(
      agent,
      dto.existingActionIds,
    );

    const newActions = await this.handleNewActions(agentId, dto.newActions);

    // Assigner les actions à l'agent
    [...existingActions, ...newActions].forEach((action) =>
      agent.addAction(action),
    );

    return this.repository.update(agent);
  }

  // --- Gérer les actions existantes ---
  private async handleExistingActions(
    agent: AiAgent,
    existingActionIds?: number[],
  ): Promise<Action[]> {
    if (!existingActionIds || existingActionIds.length === 0) return [];

    const existingActions =
      await this.actionUseCases.getByIds(existingActionIds);

    // Vérification de conflit pour chaque action existante
    await Promise.all(
      existingActions.map(async (action) => {
        if (action.type === ActionType.ASSIGN_TO_COLLECTION) {
          const collectionId = action.parameters?.collection?.id;

          const existingAction =
            await this.actionUseCases.findActionWithAgentAndCollectionExist(
              agent.id,
              collectionId,
            );

          if (existingAction) {
            throw new HttpException(
              `An action already exists for agent ID: ${agent.id}, and collection ID: ${collectionId}.`,
              HttpStatus.CONFLICT,
            );
          }
        }
      }),
    );

    return existingActions;
  }

  // --- Gérer les nouvelles actions ---
  private async handleNewActions(
    agentId: number,
    newActions?: CreateActionDto[],
  ): Promise<Action[]> {
    if (!newActions || newActions.length === 0) return [];

    // Vérification des doublons dans les nouvelles actions
    this.checkForDuplicateCollections(newActions);

    const actions = await Promise.all(
      newActions.map(async (actionDto) => {
        if (ActionType.ASSIGN_TO_COLLECTION === actionDto.type) {
          const dto = actionDto as CreateAssignToCollectionActionDto;
          const collection = await this.collectionUseCases.getOneById(
            dto.collectionId,
          );

          const existingAction =
            await this.actionUseCases.findActionWithAgentAndCollectionExist(
              agentId,
              dto.collectionId,
            );

          if (existingAction) {
            throw new HttpException(
              `An action already exists for collection ID : ${dto.collectionId}.`,
              HttpStatus.CONFLICT,
            );
          }

          return this.actionUseCases.save(
            new AssignToCollectionAction(
              undefined,
              actionDto.name,
              ActionType.ASSIGN_TO_COLLECTION,
              { collection },
            ),
          );
        }
      }),
    );

    return actions.filter((a) => a) as Action[];
  }

  // --- Vérification des doublons dans newActions ---
  private checkForDuplicateCollections(newActions: CreateActionDto[]): void {
    let collectionIds: number[] = [];
    collectionIds = newActions.map((action) => {
      if (ActionType.ASSIGN_TO_COLLECTION === action.type) {
        const entity = action as CreateAssignToCollectionActionDto;

        return entity.collectionId;
      }
    });
    const duplicates = collectionIds.filter(
      (id, index) => collectionIds.indexOf(id) !== index,
    );

    if (duplicates.length > 0) {
      throw new HttpException(
        `Duplicate collection IDs detected in newActions: ${[...new Set(duplicates)].join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }
  }
}
