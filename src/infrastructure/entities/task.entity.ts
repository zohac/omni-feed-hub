import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ActionType } from '../../domain/enums/action.type';
import { TaskMode } from '../../domain/enums/task.mode';
import { TaskStatus } from '../../domain/enums/task.status';

import { AiAgentEntity } from './ai-agent.entity';
import { ArticleEntity } from './article.entity';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    enum: ActionType,
  })
  type: ActionType;

  @Column({
    enum: TaskMode,
  })
  mode: TaskMode;

  @Column({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ type: 'json' }) // Utilisation de jsonb pour stocker le payload
  payload: Record<string, string | number>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AiAgentEntity, (agent) => agent.tasks, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  assignedAgent?: AiAgentEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.tasks, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;
}
