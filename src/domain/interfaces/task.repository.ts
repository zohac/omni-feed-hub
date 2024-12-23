// /src/domain/interfaces/ai-agent.repository.ts

import { Task } from '../entities/task';

import { IRepository } from './repository';

export interface ITaskRepository extends IRepository<Task> {
  createTasks(tasks: Task[]): Promise<Task[]>;
}
