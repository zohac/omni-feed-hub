// src/infrastructure/queues/bull-queue.service.ts

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { IQueueService } from 'src/domain/interfaces/queue.service';

@Injectable()
export class BullQueueService implements IQueueService {
  constructor(
    @InjectQueue('transcription')
    private readonly queue: Queue,
  ) {}

  async addJob(queueName: string, data: any, options?: any): Promise<any> {
    // Ici, 'queueName' pourrait être utilisé pour choisir la file appropriée si nécessaire.
    return await this.queue.add(data, options);
  }

  async getActiveJobs(queueName: string): Promise<Job[]> {
    // Renvoie les jobs actifs de la queue "transcription"
    return await this.queue.getActive();
  }

  async getPendingJobs(queueName: string): Promise<Job[]> {
    // Renvoie les jobs en attente de la queue "transcription"
    return await this.queue.getWaiting();
  }

  async getCompletedJobs(queueName: string): Promise<Job[]> {
    // Renvoie les jobs terminés de la queue "transcription"
    return await this.queue.getCompleted();
  }
}
