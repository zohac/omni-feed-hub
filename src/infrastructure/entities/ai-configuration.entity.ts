// src/infrastructure/entities/ai-configuration.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ai_configuration')
export class AiConfigurationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  model!: string;

  @Column()
  prompt!: string;

  @Column()
  stream!: boolean;

  @Column({ type: 'float', nullable: true })
  temperature?: number;
}
