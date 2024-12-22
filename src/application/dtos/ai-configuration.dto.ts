import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAiConfigurationDto {
  @IsNotEmpty()
  @IsString()
  model!: string;

  @IsNotEmpty()
  @IsString()
  prompt!: string;

  @IsNotEmpty()
  @IsBoolean()
  stream!: boolean;

  @IsOptional()
  @IsNumber()
  temperature?: number;
}

export class UpdateAiConfigurationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  stream?: boolean;

  @IsOptional()
  @IsOptional()
  @IsNumber()
  temperature?: number;
}
