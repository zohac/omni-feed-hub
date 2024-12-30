// src/domain/entities/task.ts

import { ActionType } from '../enums/action.type';
import { TaskMode } from '../enums/task.mode';
import { TaskStatus } from '../enums/task.status';
import { IEntity } from '../interfaces/entity';

import { AiAgent } from './ai-agent';
import { Article } from './article';

export class Task implements IEntity {
  constructor(
    public id: number | undefined,
    public name: string,
    public type: ActionType,
    public mode: TaskMode,
    public payload: Record<string, string | number>,
    public status: TaskStatus = TaskStatus.PENDING,
    public createdAt: Date = new Date(),
    public article: Article,
    public assignedAgent?: AiAgent,
  ) {}

  complete() {
    this.status = TaskStatus.COMPLETED;
  }

  reject() {
    this.status = TaskStatus.REJECTED;
  }
}
