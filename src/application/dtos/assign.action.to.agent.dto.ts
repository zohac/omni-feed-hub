// src/application/dtos/assign.actions.to.agent.dto.ts

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { CreateActionDto } from './action.dto';

export class AssignActionsToAgentDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v, 10)) : [],
  )
  @IsInt({ each: true })
  @IsNotEmpty()
  existingActionIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActionDto)
  @IsNotEmpty()
  newActions?: CreateActionDto[];
}
