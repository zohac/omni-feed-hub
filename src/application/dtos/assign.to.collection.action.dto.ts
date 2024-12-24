// src/application/dtos/assign.to.collection.action.dto.ts

import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { CreateActionDto, UpdateActionDto } from './action.dto';

export class CreateAssignToCollectionActionDto extends CreateActionDto {
  @IsNotEmpty()
  @IsNumber()
  collectionId!: number;
}

export class UpdateAssignToCollectionActionDto extends UpdateActionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  collectionId?: number;
}
