// src/infrastructure/entities/action.entity.ts

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

import { AiAgentEntity } from './ai-agent.entity';

@Entity('action')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class ActionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @ManyToOne(() => AiAgentEntity)
  agent?: AiAgentEntity;
}
