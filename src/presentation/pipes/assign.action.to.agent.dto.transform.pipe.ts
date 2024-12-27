// src/presentation/pipes/create.action.dto.transform.pipe.ts

import {
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';

import { AssignActionsToAgentDto } from '../../application/dtos/assign.action.to.agent.dto';
import { AssignActionToAgentDtoFactory } from '../../application/factories/assign.action.to.agent.dto.factory';

@Injectable()
export class AssignActionToAgentDtoTransformPipe implements PipeTransform {
  constructor(private readonly dtoFactory: AssignActionToAgentDtoFactory) {}

  async transform<T extends AssignActionsToAgentDto>(value: T) {
    // Transformer existingActionIds en nombres
    if (value.existingActionIds) {
      value.existingActionIds = value.existingActionIds.map((id) => {
        const parsed = parseInt(String(id), 10);
        if (isNaN(parsed)) {
          throw new BadRequestException(
            `existingActionIds contains invalid value: ${id} is not a number`,
          );
        }
        return parsed;
      });
    }

    // Transformation dynamique du DTO
    const dto = this.dtoFactory.create(value);

    // Validation du DTO après transformation
    let errors = await validate(dto);

    if (dto.newActions) {
      let assignToCollectionDtoErrors: ValidationError[] = [];
      for (const assignToCollection of dto.newActions) {
        assignToCollectionDtoErrors = assignToCollectionDtoErrors.concat(
          await validate(assignToCollection),
        );
      }

      errors = errors.concat(assignToCollectionDtoErrors);
    }

    if (errors.length > 0) {
      const messages = errors.map(
        (err) =>
          `${err.property} - ${Object.values(err.constraints).join(', ')}`,
      );
      throw new BadRequestException(messages);
    }

    return dto;
  }
}
