// src/domain/interfaces/task.command.ts

export interface ITaskCommand {
  execute(): Promise<void>;
}
