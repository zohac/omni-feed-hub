// src/application/dtos/action.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ActionType } from '../../domain/enums/action.type';

export abstract class CreateActionDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(ActionType)
  type!: ActionType;
}

export abstract class UpdateActionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ActionType)
  type?: ActionType;
}
