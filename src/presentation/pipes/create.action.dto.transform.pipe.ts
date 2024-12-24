// src/presentation/pipes/create.action.dto.transform.pipe.ts

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';

import { CreateActionDto } from '../../application/dtos/action.dto';
import { ActionDtoFactory } from '../../application/factories/action.dto.factory';

@Injectable()
export class CreateActionDtoTransformPipe implements PipeTransform {
  constructor(private readonly actionDtoFactory: ActionDtoFactory) {}

  async transform<T extends CreateActionDto>(value: T) {
    // Transformation dynamique du DTO
    const dto = this.actionDtoFactory.create(value);

    // Validation du DTO après transformation
    const errors = await validate(dto);
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
