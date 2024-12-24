// src/domain/interfaces/IActionCommand.ts

export interface IActionCommand {
  execute(): Promise<void>;
}
