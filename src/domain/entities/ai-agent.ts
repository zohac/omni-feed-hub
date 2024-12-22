// src/domain/entities/ai-agent.ts

import { AiAgentProvider } from '../enums/ai-agent.provider';
import { AiAgentRole } from '../enums/ai-agent.role';
import { IEntity } from '../interfaces/entity';

import { Action } from './action';
import { AiConfiguration } from './ai-configuration';

export class AiAgent implements IEntity {
  constructor(
    public readonly id: number | undefined,
    public name: string,
    public description: string,
    public provider: AiAgentProvider,
    public role: AiAgentRole,
    public configuration: AiConfiguration,
    private _actions: Action[] = [],
  ) {}

  get actions(): Action[] {
    return this._actions;
  }

  addAction(action: Action): void {
    this._actions.push(action);
  }

  removeAction(actionId: number): void {
    this._actions = this._actions.filter((a) => a.id !== actionId);
  }

  // --- MÉTHODES MÉTIER ---
  executeAction(action: Action): string {
    if (!this._actions.includes(action)) {
      throw new Error(`Action ${action.name} non reconnue pour cet agent.`);
    }
    return `Exécution de l'action ${action.name} par l'agent ${this.name}`;
  }

  canHandleTask(taskType: AiAgentRole): boolean {
    return this.role === taskType;
  }
}
