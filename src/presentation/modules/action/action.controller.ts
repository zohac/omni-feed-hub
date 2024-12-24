import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  CreateActionDto,
  UpdateActionDto,
} from '../../../application/dtos/action.dto';
import { ActionUseCases } from '../../../application/usecases/action.use-cases';
import { IBaseAction } from '../../../domain/entities/action';
import { CreateActionDtoTransformPipe } from '../../pipes/create.action.dto.transform.pipe';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';
import { UpdateActionDtoTransformPipe } from '../../pipes/update.action.dto.transform.pipe';

@Controller('actions')
export class ActionController {
  constructor(private readonly useCase: ActionUseCases) {}

  @ApiOperation({ summary: 'Retrieve all Actions' })
  @ApiResponse({
    status: 200,
    description: 'List of Actions returned successfully.',
  })
  @Get()
  async getAllActions(): Promise<IBaseAction[]> {
    return await this.useCase.getAll();
  }

  @ApiOperation({ summary: 'Get a single Actions by its ID' })
  @ApiResponse({ status: 200, description: 'Action found.' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @Get('/:id')
  async getActionById(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<IBaseAction> {
    return await this.useCase.getOneById(id);
  }

  @ApiOperation({
    summary: 'Create a new Action',
    description: 'Creates a new AI agent in the system.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Action created successfully. Returns the created Action object.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict: An AI agent with the same Article Collection already exists. No new Action is created.',
  })
  @Post()
  @UsePipes(CreateActionDtoTransformPipe)
  async createAction<T extends CreateActionDto>(
    @Body() dto: T,
  ): Promise<IBaseAction> {
    return await this.useCase.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing Action' })
  @ApiResponse({
    status: 200,
    description: 'Action updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  @ApiResponse({
    status: 409,
    description:
      'Conflict: An AI agent with the same Article Collection already exists. No new Action is created.',
  })
  @Put('/:id')
  @UsePipes(UpdateActionDtoTransformPipe)
  async updateAction<T extends UpdateActionDto>(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: T,
  ): Promise<IBaseAction> {
    return await this.useCase.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an Action' })
  @ApiResponse({
    status: 204,
    description: 'Action deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteAction(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.useCase.delete(id);
  }
}
