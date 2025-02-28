// src/presentation/modules/post/post.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  Put,
} from '@nestjs/common';

import { PostUseCases } from 'src/application/usecases/post.use-cases';

import {
  CreatePostDto,
  UpdatePostDto,
} from '../../../application/dtos/post.dto';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('posts')
export class PostController {
  constructor(private readonly postUseCases: PostUseCases) {}

  @HttpPost()
  async create(@Body() dto: CreatePostDto) {
    return this.postUseCases.createPost(dto);
  }

  @Get()
  async getAllPosts() {
    return this.postUseCases.getAll();
  }

  @Get('/:id')
  async getPostById(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.postUseCases.getOneById(id);
  }

  @Patch('/:id/publish')
  async publish(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.postUseCases.publishPost(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postUseCases.updatePost(id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.postUseCases.deletePost(id);
  }
}
