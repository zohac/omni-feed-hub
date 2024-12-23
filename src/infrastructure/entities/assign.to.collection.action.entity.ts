// src/infrastructure/entities/AssignToCollectionActionEntity.ts

import { ChildEntity, JoinColumn, OneToOne } from 'typeorm';

import { ActionEntity } from './action.entity';
import { ArticleCollectionEntity } from './article.collection.entity';

@ChildEntity('ASSIGN_TO_COLLECTION')
export class AssignToCollectionActionEntity extends ActionEntity {
  @OneToOne(() => ArticleCollectionEntity, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  collection?: ArticleCollectionEntity;
}
