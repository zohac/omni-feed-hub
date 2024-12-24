// src/application/usecases/action.use-cases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Action } from '../../domain/entities/action';
import { AssignToCollectionAction } from '../../domain/entities/assign.to.collection.action';
import { ActionType } from '../../domain/enums/action.type';
import { IActionRepository } from '../../domain/interfaces/action.repository';
import { CreateActionDto, UpdateActionDto } from '../dtos/action.dto';
import {
  CreateAssignToCollectionActionDto,
  UpdateAssignToCollectionActionDto,
} from '../dtos/assign.to.collection.action.dto';

import { ArticleCollectionUseCases } from './article.collection.use-cases';

@Injectable()
export class ActionUseCases {
  constructor(
    @Inject('IRepository<Action>')
    private readonly repository: IActionRepository,
    private readonly collectionUseCase: ArticleCollectionUseCases,
  ) {}

  async getAll(): Promise<Action[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<Action> {
    const actionDto = await this.repository.getOneById(id);
    if (!actionDto) {
      throw new HttpException('Action not found.', HttpStatus.NOT_FOUND);
    }

    return actionDto;
  }

  async create(actionDto: CreateActionDto): Promise<Action> {
    if (ActionType.ASSIGN_TO_COLLECTION === actionDto.type) {
      const dto = actionDto as CreateAssignToCollectionActionDto;
      const collection = await this.collectionUseCase.getOneById(
        dto.collectionId,
      );

      // Vérification si une action existe déjà pour cette collection
      const existingAction = await this.repository.findActionExistForCollection(
        dto.collectionId,
      );

      if (existingAction) {
        throw new HttpException(
          `An action already exists for collection ID : ${dto.collectionId}.`,
          HttpStatus.CONFLICT, // 409 Conflict
        );
      }

      const action = new AssignToCollectionAction(
        undefined,
        actionDto.name,
        ActionType.ASSIGN_TO_COLLECTION,
        {
          collection: collection,
        },
      );

      return await this.repository.create(action);
    }

    throw new HttpException('Action type not found.', HttpStatus.NOT_FOUND);
  }

  async update(id: number, actionDto: UpdateActionDto): Promise<Action> {
    const action = await this.getOneById(id);

    if (undefined === actionDto.type) {
      actionDto.type = action.type;
    }

    if (ActionType.ASSIGN_TO_COLLECTION === actionDto.type) {
      const dto = actionDto as UpdateAssignToCollectionActionDto;

      if (undefined !== dto.name) action.name = dto.name;

      if (undefined !== dto.collectionId) {
        const existingAction =
          await this.repository.findActionExistForCollection(dto.collectionId);

        // Si une autre action utilise déjà cette collection, renvoyer une erreur 409
        if (existingAction && existingAction.id !== id) {
          throw new HttpException(
            `Another action already exists for collection ID ${dto.collectionId}.`,
            HttpStatus.CONFLICT,
          );
        }

        action.parameters.collection = await this.collectionUseCase.getOneById(
          dto.collectionId,
        );
      }

      const updatedAction = await this.repository.update(action);

      if (!updatedAction) {
        throw new HttpException(
          `Failed to update Action with ID ${id}. It may not exist.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return updatedAction;
    }

    throw new HttpException('Action type not found.', HttpStatus.NOT_FOUND);
  }

  async delete(id: number): Promise<void> {
    const action = await this.getOneById(id);

    await this.repository.delete(action.id);
  }
}
