import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../../domain/entities/task';
import { ITaskRepository } from '../../domain/interfaces/task.repository';
import { TaskEntity } from '../entities';
import { TaskMapper } from '../mappers/task.mapper';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  async getOneById(id: number): Promise<Task | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['assignedAgent'],
    });
    if (!entity) return null;

    return TaskMapper.toDomain(entity);
  }

  async getAll(): Promise<Task[]> {
    const entities = await this.repository.find({
      relations: ['assignedAgent'],
    });
    return entities.map((entity) => TaskMapper.toDomain(entity));
  }

  async create(task: Task): Promise<Task> {
    const taskEntity = TaskMapper.toEntity(task);
    console.log(taskEntity);
    const entity = this.repository.create(taskEntity);
    const result = await this.repository.save(entity);

    return TaskMapper.toDomain(result);
  }

  async update(task: Task): Promise<Task | null> {
    const taskEntity = TaskMapper.toEntity(task);

    await this.repository.update(taskEntity.id, taskEntity);

    return await this.getOneById(taskEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async createTasks(tasks: Task[]): Promise<Task[]> {
    const entities: TaskEntity[] = tasks.map((task) =>
      TaskMapper.toEntity(task),
    );
    const results = this.repository.create(entities);

    return results.map((entity) => TaskMapper.toDomain(entity));
  }
}
