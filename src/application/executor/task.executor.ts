// src/application/executor/task.executor.ts

import { Inject, Injectable } from '@nestjs/common';

import { Task } from '../../domain/entities/task';
import { ActionType } from '../../domain/enums/action.type';
import { TaskMode } from '../../domain/enums/task.mode';
import { TaskStatus } from '../../domain/enums/task.status';
import { ILogger } from '../../domain/interfaces/logger';
import { ITaskCommand } from '../../domain/interfaces/task.command';
import { CommandFactory } from '../factories/command.factory';
import { TaskUseCases } from '../usecases/task.use-cases';

@Injectable()
export class TaskExecutor {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly taskUseCases: TaskUseCases,
    private readonly commandFactory: CommandFactory,
  ) {}

  async execute(tasks: Task[]): Promise<void> {
    await this.executeDirectTask(tasks);
  }

  async executeDirectTask(tasks: Task[]): Promise<void> {
    const executionPromises = tasks.map(async (task) => {
      try {
        // Lancer la tâche directe si elle est en mode direct
        if (
          TaskMode.DIRECT === task.mode &&
          TaskStatus.PENDING === task.status
        ) {
          let command: ITaskCommand;

          switch (task.type) {
            case ActionType.ASSIGN_TO_COLLECTION: {
              const { articleId, collectionId } = task.payload as {
                articleId: number;
                collectionId: number;
              };

              command = this.commandFactory.createAssignToCollectionCommand(
                articleId,
                collectionId,
              );
              break;
            }
            // Gérez d'autres types d'actions
            default:
              throw new Error(`Unknown action type : ${task.type}`);
          }
          await command.execute();

          task.complete();

          await this.taskUseCases.update(task); // Met à jour la tâche comme complétée
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(`Error executing task ${task.id}: ${errorMessage}`);

        task.reject();
        await this.taskUseCases.update(task); // Marque la tâche comme rejetée
      }
    });

    // Paralléliser les exécutions
    await Promise.allSettled(executionPromises);
  }
}
