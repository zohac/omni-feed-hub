import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AgentWorkflowStatus } from '../../domain/enums/agent.workflow.status';

import { AgentWorkflowEntity } from './agent.workflow.entity';

@Entity('agent_workflow_step')
export class AgentWorkflowStepEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stepType: string;

  @Column()
  agentId: number;

  @Column({ default: 'pending' })
  status: AgentWorkflowStatus;

  @Column({ type: 'json', nullable: true })
  inputData: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  outputData: Record<string, any>;

  @ManyToOne(() => AgentWorkflowEntity, (workflow) => workflow.steps)
  @JoinColumn({ name: 'workflow_id' })
  workflow?: AgentWorkflowEntity;
}
