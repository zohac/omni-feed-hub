import { AgentWorkflowStatus } from '../enums/agent.workflow.status';

import { AgentWorkflowStep } from './agent.workflow.step';

export class AgentWorkflow {
  constructor(
    public id: number,
    public name: string,
    public status: AgentWorkflowStatus,
    public steps: AgentWorkflowStep[] = [],
  ) {}
}
