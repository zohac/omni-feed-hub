import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleAnalysis } from '../../domain/entities/article.analyse';
import { IRepository } from '../../domain/interfaces/repository';
import { ArticleAnalysisEntity } from '../entities/article.analyse.entity';
import { ArticleAnalysisMapper } from '../mappers/article.analysis.mapper';

@Injectable()
export class ArticleAnalysisRepository implements IRepository<ArticleAnalysis> {
  constructor(
    @InjectRepository(ArticleAnalysisEntity)
    private readonly repository: Repository<ArticleAnalysisEntity>,
  ) {}

  async create(analysis: ArticleAnalysis): Promise<ArticleAnalysis> {
    const analysisEntity = ArticleAnalysisMapper.toEntity(analysis);
    const entity = this.repository.create(analysisEntity);
    const result = await this.repository.save(entity);

    return ArticleAnalysisMapper.toDomain(result);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getAll(): Promise<ArticleAnalysis[]> {
    const entities = await this.repository.find({
      relations: ['article', 'agent'],
    });

    return entities.map((entity) => ArticleAnalysisMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<ArticleAnalysis | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['article', 'agent'],
    });
    if (!entity) return null;

    return ArticleAnalysisMapper.toDomain(entity);
  }

  async update(analysis: ArticleAnalysis): Promise<ArticleAnalysis | null> {
    const analysisEntity = ArticleAnalysisMapper.toEntity(analysis);
    await this.repository.save(analysisEntity);

    return await this.getOneById(analysisEntity.id);
  }
}
