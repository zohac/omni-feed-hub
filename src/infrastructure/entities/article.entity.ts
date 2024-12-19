import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MediaAttachmentEntity } from './media.attachment.entity';
import { RssFeedEntity } from './rss-feed.entity';

export enum ArticleSourceType {
  MANUAL = 'manual',
  RSS = 'rss',
}

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  publicationAt: Date;

  @Column({ enum: ArticleSourceType })
  sourceType: ArticleSourceType;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'boolean', default: false })
  isSaved: boolean;

  @ManyToOne(() => RssFeedEntity, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  feed?: RssFeedEntity;

  @Column({ nullable: true })
  link?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'json', nullable: true })
  tags?: { id: string; label: string }[];

  @OneToMany(
    () => MediaAttachmentEntity,
    (mediaAttachment) => mediaAttachment.article,
    {
      cascade: true, // S'assurer que les MediaAttachments sont enregistrés avec l'article
      eager: true, // Charger automatiquement les MediaAttachments avec l'article
    },
  )
  mediaAttachments: MediaAttachmentEntity[];

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
