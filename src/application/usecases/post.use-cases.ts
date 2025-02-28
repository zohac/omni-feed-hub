// src/application/usecases/post.use-cases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Post } from 'src/domain/entities/post';
import { IRepository } from 'src/domain/interfaces/repository';

import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';

import { ArticleUseCases } from './article.use-cases';

@Injectable()
export class PostUseCases {
  constructor(
    @Inject('IRepository<Post>')
    private readonly repository: IRepository<Post>,
    private readonly articleUseCases: ArticleUseCases,
  ) {}

  async createPost(dto: CreatePostDto): Promise<Post> {
    const post = new Post(
      undefined,
      dto.title,
      dto.content,
      dto.originalContent,
      dto.recommendation,
      dto.explanation,
      dto.scheduledAt || null,
      null,
      false,
    );

    if (undefined !== dto.articlesId) {
      post.articles = [];
      for (const id of dto.articlesId) {
        const article = await this.articleUseCases.getOneById(id);
        post.articles.push(article);
      }
    }

    return this.repository.create(post);
  }

  async getAll(): Promise<Post[]> {
    return this.repository.getAll();
  }

  async getOneById(id: number): Promise<Post> {
    const post = await this.repository.getOneById(id);
    if (!post) {
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  async publishPost(postId: number): Promise<Post> {
    const post = await this.getOneById(postId);

    if (post.published) {
      return post; // déjà publié
    }
    post.published = true;
    post.publishedAt = new Date();
    return this.repository.update(post);
  }

  async updatePost(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.getOneById(id);

    if (undefined !== dto?.title) post.title = dto.title;
    if (undefined !== dto?.content) post.content = dto.content;
    if (undefined !== dto?.originalContent)
      post.originalContent = dto.originalContent;
    if (undefined !== dto?.recommendation)
      post.recommendation = dto.recommendation;
    if (undefined !== dto?.explanation) post.explanation = dto.explanation;
    if (undefined !== dto?.scheduledAt) post.scheduledAt = dto.scheduledAt;
    if (undefined !== dto?.published) post.published = dto.published;

    return this.repository.update(post);
  }

  async deletePost(postId: number): Promise<void> {
    return this.repository.delete(postId);
  }
}
