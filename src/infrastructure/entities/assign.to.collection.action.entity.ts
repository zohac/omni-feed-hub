// src/infrastructure/entities/AssignToCollectionActionEntity.ts

import { ChildEntity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { ActionEntity } from './action.entity';
import { ArticleCollectionEntity } from './article.collection.entity';

@ChildEntity('ASSIGN_TO_COLLECTION')
@Unique(['agent', 'collection'])
export class AssignToCollectionActionEntity extends ActionEntity {
  @ManyToOne(() => ArticleCollectionEntity, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  collection?: ArticleCollectionEntity;
}
