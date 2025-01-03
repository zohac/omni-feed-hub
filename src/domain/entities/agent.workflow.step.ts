import { AgentWorkflowStatus } from '../enums/agent.workflow.status';

import { AgentWorkflow } from './agent.workflow';

export class AgentWorkflowStep {
  constructor(
    public id: number,
    public stepType: string,
    public agentId: number,
    public status: AgentWorkflowStatus,
    public inputData: Record<string, any> = {},
    public outputData: Record<string, any> = {},
    public workflow?: AgentWorkflow,
  ) {}
}
