import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  CreateAiAgentDto,
  UpdateAiAgentDto,
} from '../../../application/dtos/ai-agent.dto';
import { AiAgentUseCases } from '../../../application/usecases/ai-agent.use-cases';
import { AiAgent } from '../../../domain/entities/ai-agent';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('agents')
export class AiAgentController {
  constructor(private readonly useCase: AiAgentUseCases) {}

  @ApiOperation({ summary: 'Retrieve all AI agents' })
  @ApiResponse({
    status: 200,
    description: 'List of AI agents returned successfully.',
  })
  @Get()
  async getAllAgents(): Promise<AiAgent[]> {
    return await this.useCase.getAll();
  }

  @ApiOperation({ summary: 'Get a single AI agent by its ID' })
  @ApiResponse({ status: 200, description: 'AiAgent found.' })
  @ApiResponse({ status: 404, description: 'AiAgent not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @Get('/:id')
  async getAgentById(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<AiAgent> {
    return await this.useCase.getOneById(id);
  }

  @ApiOperation({
    summary: 'Create a new AI agent',
    description:
      'Creates a new AI agent in the system. If an AI agent with the same link already exists, the request will fail with a conflict error (HTTP 409).',
  })
  @ApiResponse({
    status: 201,
    description:
      'AiAgent created successfully. Returns the created AI agent object.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict: An AI agent with the same link already exists. No new AI agent is created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @Post()
  async createAgent(@Body() dto: CreateAiAgentDto): Promise<AiAgent> {
    return await this.useCase.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing AI agent' })
  @ApiResponse({ status: 200, description: 'AiAgent updated successfully.' })
  @ApiResponse({ status: 404, description: 'AiAgent not found.' })
  @Put('/:id')
  async updateAgent(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateAiAgentDto,
  ): Promise<AiAgent> {
    return await this.useCase.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an AI agent' })
  @ApiResponse({ status: 204, description: 'AiAgent deleted successfully.' })
  @ApiResponse({ status: 404, description: 'AiAgent not found.' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteAgent(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.useCase.delete(id);
  }
}
