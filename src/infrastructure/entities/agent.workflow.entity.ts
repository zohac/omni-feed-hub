import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AgentWorkflowStatus } from '../../domain/enums/agent.workflow.status';

import { AgentWorkflowStepEntity } from './agent.workflow.step.entity';

@Entity('agent_workflow')
export class AgentWorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'pending' })
  status: AgentWorkflowStatus;

  @OneToMany(() => AgentWorkflowStepEntity, (step) => step.workflow, {
    cascade: true,
  })
  @JoinColumn()
  steps: AgentWorkflowStepEntity[];
}
