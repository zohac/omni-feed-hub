// src/infrastructure/mappers/action.mapper.ts

import { HttpException, HttpStatus } from '@nestjs/common';

import { Action } from '../../domain/entities/Action';
import { AssignToCollectionAction } from '../../domain/entities/assign.to.collection.action';
import { ActionType } from '../../domain/enums/action.type';
import { ActionEntity, AssignToCollectionActionEntity } from '../entities';

import { ArticleCollectionMapper } from './article.collection.mapper';

export class ActionMapper {
  static toDomain(entity: ActionEntity): Action {
    switch (entity.type) {
      case ActionType.ASSIGN_TO_COLLECTION: {
        const assignEntity = entity as AssignToCollectionActionEntity;

        const assignToCollectionAction = new AssignToCollectionAction(
          assignEntity.id,
          assignEntity.name,
          ActionType.ASSIGN_TO_COLLECTION,
          {
            collection: undefined,
          },
        );

        if (undefined !== assignEntity.collection) {
          assignToCollectionAction.parameters.collection =
            ArticleCollectionMapper.toPartialDomain(assignEntity.collection);
        }

        return assignToCollectionAction;
      }

      default:
        throw new HttpException(
          `Action type not found:  ${entity.type}`,
          HttpStatus.NOT_FOUND,
        );
    }
  }

  // Méthode pour convertir du domaine vers l'entité
  static toEntity(action: Action): ActionEntity {
    switch (action.type) {
      case ActionType.ASSIGN_TO_COLLECTION: {
        const assignAction = action as AssignToCollectionAction;
        const assignEntity = new AssignToCollectionActionEntity();

        if (undefined !== assignAction.id) assignEntity.id = assignAction.id;
        assignEntity.name = assignAction.name;
        assignEntity.type = assignAction.type;

        if (undefined !== assignAction.parameters.collection) {
          assignEntity.collection = ArticleCollectionMapper.toPartialEntity(
            assignAction.parameters.collection,
          );
        }

        return assignEntity;
      }

      default:
        throw new HttpException(
          `Action type not found:  ${action.type}`,
          HttpStatus.NOT_FOUND,
        );
    }
  }
}
