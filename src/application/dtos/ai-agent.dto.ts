// src/application/dtos/ArticleDTO.ts
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AiAgentProvider } from '../../domain/enums/ai-agent.provider';
import { AiAgentRole } from '../../domain/enums/ai-agent.role';

import {
  CreateAiConfigurationDto,
  UpdateAiConfigurationDto,
} from './ai-configuration.dto';

export class CreateAiAgentDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsEnum(AiAgentProvider)
  provider!: AiAgentProvider;

  @IsNotEmpty()
  @IsEnum(AiAgentRole)
  role!: AiAgentRole;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAiConfigurationDto)
  configuration!: CreateAiConfigurationDto;
}

export class UpdateAiAgentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(AiAgentProvider)
  provider?: AiAgentProvider;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(AiAgentRole)
  role?: AiAgentRole;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateAiConfigurationDto)
  configuration!: UpdateAiConfigurationDto;
}
