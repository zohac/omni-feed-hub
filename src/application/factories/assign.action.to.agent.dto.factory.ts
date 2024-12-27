// src/application/factories/action.dto.factory.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ActionType } from '../../domain/enums/action.type';
import { CreateActionDto } from '../dtos/action.dto';
import { AssignActionsToAgentDto } from '../dtos/assign.action.to.agent.dto';
import { CreateAssignToCollectionActionDto } from '../dtos/assign.to.collection.action.dto';

@Injectable()
export class AssignActionToAgentDtoFactory {
  create(dto: AssignActionsToAgentDto): AssignActionsToAgentDto {
    if (undefined !== dto.newActions) {
      const entities: CreateActionDto[] = [];

      for (const action of dto.newActions) {
        if (ActionType.ASSIGN_TO_COLLECTION === action.type) {
          entities.push(
            plainToInstance(CreateAssignToCollectionActionDto, action),
          );
        } else {
          throw new BadRequestException(
            `Unsupported action type: ${action.type}`,
          );
        }
      }

      dto.newActions = entities;
    }

    return dto;
  }
}
