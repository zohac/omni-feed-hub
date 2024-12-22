// src/infrastructure/mappers/AIConfigurationMapper.ts

import { AiConfiguration } from '../../domain/entities/ai-configuration';
import { AiConfigurationEntity } from '../entities/ai-configuration.entity';

export class AiConfigurationMapper {
  static toDomain(entity: AiConfigurationEntity): AiConfiguration {
    return new AiConfiguration(
      entity.id,
      entity.model,
      entity.prompt,
      entity.stream,
      entity.temperature,
    );
  }

  static toEntity(domain: AiConfiguration): AiConfigurationEntity {
    const entity = new AiConfigurationEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.model = domain.model;
    entity.prompt = domain.prompt;
    entity.stream = domain.stream;
    entity.temperature = domain.temperature;

    return entity;
  }
}
