// src/infrastructure/entities/AIAgentEntity.ts

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AiConfigurationEntity } from './ai-configuration.entity';

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

  // @OneToMany(() => ActionEntity, (actionEntity) => actionEntity.agent, {
  //   cascade: true,
  //   eager: true,
  // })
  // actions?: ActionEntity[];
}
