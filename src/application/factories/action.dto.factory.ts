// src/application/factories/action.dto.factory.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ActionType } from '../../domain/enums/action.type';
import { CreateActionDto, UpdateActionDto } from '../dtos/action.dto';
import {
  CreateAssignToCollectionActionDto,
  UpdateAssignToCollectionActionDto,
} from '../dtos/assign.to.collection.action.dto';

@Injectable()
export class ActionDtoFactory {
  create(dto: CreateActionDto): CreateActionDto {
    switch (dto.type) {
      case ActionType.ASSIGN_TO_COLLECTION:
        return plainToInstance(CreateAssignToCollectionActionDto, dto);

      default:
        throw new BadRequestException(`Unsupported action type: ${dto.type}`);
    }
  }

  update(dto: UpdateActionDto): UpdateActionDto {
    if (!dto.type) {
      return plainToInstance(UpdateAssignToCollectionActionDto, dto); // Retourne un DTO de base
    }

    switch (dto.type) {
      case ActionType.ASSIGN_TO_COLLECTION:
        return plainToInstance(UpdateAssignToCollectionActionDto, dto);

      default:
        throw new BadRequestException(`Unsupported action type: ${dto.type}`);
    }
  }
}
