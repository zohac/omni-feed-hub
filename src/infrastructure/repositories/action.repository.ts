// src/infrastructure/repositories/action.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action } from '../../domain/entities/action';
import { IActionRepository } from '../../domain/interfaces/action.repository';
import { ActionEntity } from '../entities';
import { ActionMapper } from '../mappers/action.mapper';

@Injectable()
export class ActionRepository implements IActionRepository {
  constructor(
    @InjectRepository(ActionEntity)
    private readonly repository: Repository<ActionEntity>,
  ) {}

  async getAll(): Promise<Action[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ActionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Action | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    return ActionMapper.toDomain(entity);
  }

  async create(domain: Action): Promise<Action> {
    const actionEntity = ActionMapper.toEntity(domain);

    const entity = this.repository.create(actionEntity);
    const result = await this.repository.save(entity);

    return ActionMapper.toDomain(result);
  }

  async update(domain: Action): Promise<Action | null> {
    const actionEntity = ActionMapper.toEntity(domain);

    await this.repository.update(actionEntity.id, actionEntity);

    return await this.getOneById(domain.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findActionExistForCollection(
    collectionId: number,
  ): Promise<Action | null> {
    const entity = await this.repository
      .createQueryBuilder('action')
      .where('collectionId = :collectionId', { collectionId })
      .getOne();
    if (!entity) return null;

    return ActionMapper.toDomain(entity);
  }

  async findActionWithAgentAndCollectionExist(
    agentId: number,
    collectionId: number,
  ): Promise<Action | null> {
    const entity = await this.repository
      .createQueryBuilder('action')
      .where('agentId = :agentId', { agentId })
      .andWhere('collectionId = :collectionId', { collectionId })
      .getOne();
    if (!entity) return null;

    return ActionMapper.toDomain(entity);
  }
}
