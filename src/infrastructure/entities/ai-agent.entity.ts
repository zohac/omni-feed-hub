// src/infrastructure/entities/AIAgentEntity.ts

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ActionEntity } from './action.entity';
import { AiConfigurationEntity } from './ai-configuration.entity';
import { TaskEntity } from './task.entity';

@Entity('ai_agent')
export class AiAgentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  provider!: string;

  @Column()
  role!: string;

  @OneToOne(() => AiConfigurationEntity, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  configuration!: AiConfigurationEntity;

  @OneToMany(() => ActionEntity, (entity) => entity.agent, {
    cascade: true,
    eager: true,
  })
  actions?: ActionEntity[];

  @OneToMany(() => TaskEntity, (entity) => entity.assignedAgent, {
    cascade: true,
  })
  tasks?: TaskEntity[];
}
