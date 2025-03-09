// src/infrastructure/repositories/post.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from 'src/domain/entities/post';
import { IRepository } from 'src/domain/interfaces/repository';
import { Repository } from 'typeorm';

import { PostEntity } from '../entities';
import { PostMapper } from '../mappers/post.mapper';

@Injectable()
export class PostRepository implements IRepository<Post> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
  ) {}

  async create(post: Post): Promise<Post> {
    const newPostEntity = PostMapper.toEntity(post);
    const savedPostEntity = await this.repository.save(newPostEntity);

    return PostMapper.toDomain(savedPostEntity);
  }

  async getAll(): Promise<Post[]> {
    const entities = await this.repository.find({
      relations: ['articles'],
    });

    return entities.map((entity) => PostMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Post | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['articles'],
    });
    return entity ? PostMapper.toDomain(entity) : null;
  }

  async update(post: Post): Promise<Post> {
    // On peut d’abord vérifier l’existence
    const existing = await this.getOneById(post.id);
    if (!existing) {
      throw new Error(`Post with id ${post.id} not found`);
    }

    // Merge des propriétés
    const entityToUpdate = PostMapper.toEntity(post);
    // TypeORM va préserver l'ID déjà existant
    entityToUpdate.id = existing.id;

    // On sauvegarde
    const updatedEntity = await this.repository.save(entityToUpdate);
    return PostMapper.toDomain(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
