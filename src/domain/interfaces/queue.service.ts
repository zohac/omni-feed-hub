// src/domain/interfaces/queue.ts

import { Job } from 'bull';

export interface IQueueService {
  addJob(queueName: string, data: any, options?: any): Promise<any>;

  getActiveJobs(queueName: string): Promise<Job[]>;

  getPendingJobs(queueName: string): Promise<Job[]>;

  getCompletedJobs(queueName: string): Promise<Job[]>;
}
