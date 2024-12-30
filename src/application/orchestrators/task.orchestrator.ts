// src/orchestrators/task.orchestrator.ts

import { Inject, Injectable } from '@nestjs/common';

import { Action } from '../../domain/entities/action';
import { AiAgent } from '../../domain/entities/ai-agent';
import { Article } from '../../domain/entities/article';
import { Task } from '../../domain/entities/task';
import { ILogger } from '../../domain/interfaces/logger';
import { TaskExecutor } from '../executor/task.executor';
import { TaskUseCases } from '../usecases/task.use-cases';

@Injectable()
export class TaskOrchestrator {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly taskUseCases: TaskUseCases,
    private readonly taskExecutor: TaskExecutor,
  ) {}

  async create(task: Task): Promise<Task> {
    return await this.taskUseCases.create(task);
  }

  async executeTaskDirectly(task: Task): Promise<void> {
    // Lancer immédiatement la tâche directe
    this.logger.log(`Exécution immédiate de la tâche ${task.id}`);
    await this.taskExecutor.execute([task]);
  }

  async createNewTask(
    action: Action,
    article: Article,
    agent: AiAgent,
  ): Promise<Task | null> {
    return await this.taskUseCases.createNewTask(action, article, agent);
  }
}
