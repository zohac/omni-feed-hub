// src/infrastrucuture/entities/article.analysis.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArticleAnalysisStatus } from '../../domain/enums/article.analysis.status';

import { AiAgentEntity } from './ai-agent.entity';
import { ArticleEntity } from './article.entity';

@Entity('article_analysis')
export class ArticleAnalysisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArticleEntity)
  article: ArticleEntity;

  @ManyToOne(() => AiAgentEntity)
  agent: AiAgentEntity;

  @Column({
    enum: ArticleAnalysisStatus,
    default: ArticleAnalysisStatus.PENDING,
  })
  status: ArticleAnalysisStatus;

  @Column({ nullable: true })
  result: string;

  @CreateDateColumn()
  createdAt: Date;
}
