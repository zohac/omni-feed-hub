// src/infrastructure/entities/post.entity.ts

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { MediaAttachmentEntity } from './media.attachment.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  originalContent: string;

  @Column({ type: 'text' })
  recommendation: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ default: false })
  published: boolean;

  @OneToMany(() => MediaAttachmentEntity, (attachment) => attachment.post, {
    cascade: true,
  })
  attachments: MediaAttachmentEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.post, {
    cascade: true,
  })
  articles?: ArticleEntity[];
}
