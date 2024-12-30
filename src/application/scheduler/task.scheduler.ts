import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger } from '../../domain/interfaces/logger';
import { TaskExecutor } from '../executor/task.executor';
import { TaskUseCases } from '../usecases/task.use-cases';

@Injectable()
export class TaskScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly taskUseCases: TaskUseCases,
    private readonly taskExecutor: TaskExecutor,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handlePendingTasks(): Promise<void> {
    this.logger.log('Checking for pending tasks...');

    const pendingTasks = await this.taskUseCases.getPendingTasks();

    if (pendingTasks.length > 0) {
      this.logger.log(`Found ${pendingTasks.length} pending tasks.`);
      await this.taskExecutor.execute(pendingTasks);
    } else {
      this.logger.log('No pending tasks found.');
    }
  }
}
