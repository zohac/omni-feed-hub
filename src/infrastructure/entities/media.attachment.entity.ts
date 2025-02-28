import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { PostEntity } from './post.entity';

@Entity('media_attachment')
export class MediaAttachmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'integer', nullable: true })
  width?: number;

  @Column({ type: 'integer', nullable: true })
  height?: number;

  @Column({ type: 'integer', nullable: true })
  length?: number;

  @Column({ nullable: true })
  title?: string;

  @ManyToOne(() => ArticleEntity, (article) => article.mediaAttachments, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;

  @ManyToOne(() => PostEntity, (post) => post.attachments, {
    onDelete: 'CASCADE',
  })
  post: PostEntity;
}
