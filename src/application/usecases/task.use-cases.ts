// src/application/usescases/task.use-cases.ts

import { Inject, Injectable } from '@nestjs/common';

import { Action } from '../../domain/entities/action';
import { AiAgent } from '../../domain/entities/ai-agent';
import { Article } from '../../domain/entities/article';
import { Task } from '../../domain/entities/task';
import { ActionType } from '../../domain/enums/action.type';
import { TaskMode } from '../../domain/enums/task.mode';
import { TaskStatus } from '../../domain/enums/task.status';
import { ITaskRepository } from '../../domain/interfaces/task.repository';

@Injectable()
export class TaskUseCases {
  constructor(
    @Inject('IRepository<Task>')
    private readonly repository: ITaskRepository,
  ) {}

  async create(task: Task): Promise<Task> {
    return await this.repository.create(task);
  }

  async createNewTask(
    action: Action,
    article: Article,
    agent: AiAgent,
  ): Promise<Task | null> {
    let newTask: Task | null = null;
    if (ActionType.ASSIGN_TO_COLLECTION === action.type) {
      newTask = new Task(
        undefined,
        `assign article ID : ${article.id} to the article collection ID : ${action.parameters.collection.id}`,
        ActionType.ASSIGN_TO_COLLECTION,
        TaskMode.DIRECT,
        {
          articleId: article.id,
          collectionId: action.parameters.collection.id,
        },
        TaskStatus.PENDING,
        new Date(),
        article,
        agent,
      );
    }
    return newTask;
  }

  async update(task: Task): Promise<Task> {
    return await this.repository.update(task);
  }

  async getPendingTasks(): Promise<Task[]> {
    return await this.repository.getPendingTasks();
  }
}
