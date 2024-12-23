// src/application/usecases/analysis.use-cases.ts

import { Inject, Injectable } from '@nestjs/common';

import { AiAgent } from '../../domain/entities/ai-agent';
import { Article } from '../../domain/entities/Article';
import { Task } from '../../domain/entities/task';
import { ActionType } from '../../domain/enums/action.type';
import { AiAgentRole } from '../../domain/enums/ai-agent.role';
import { TaskMode } from '../../domain/enums/task.mode';
import { TaskStatus } from '../../domain/enums/task.status';
import { IAiServiceFactory } from '../../domain/interfaces/ai-service.factory';
import { ILogger } from '../../domain/interfaces/logger';
import { ITaskRepository } from '../../domain/interfaces/task.repository';

import { AiAgentUseCases } from './ai-agent.use-cases';
import { ArticleUseCases } from './article.use-cases';

@Injectable()
export class AnalysisUseCases {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    @Inject('IRepository<Task>')
    private readonly repository: ITaskRepository,
    @Inject('IAiServiceFactory')
    private readonly aiServiceFactory: IAiServiceFactory,
    private readonly articleUseCases: ArticleUseCases,
    private readonly agentUseCases: AiAgentUseCases,
  ) {}

  async analysisOneArticleWithAgent(
    agentId: number,
    articleId: number,
  ): Promise<Task> {
    const article = await this.articleUseCases.getOneById(articleId);
    const agent = await this.agentUseCases.getOneById(agentId);

    this.logger.log("Début de l'analyse d'un article.");
    const task = await this.analysis(agent, article);
    this.logger.log("Fin  de l'analyse d'un article.");

    return await this.create(task);
  }

  async analysisAllByOneAgent(agent: AiAgent): Promise<Task[]> {
    this.logger.log(
      `Début de l'analyse de tous les articles par l'agent : ${agent.name}.`,
    );

    let tasks: Task[] = [];

    if (undefined !== agent.id) {
      const articles = await this.articleUseCases.getUnanalyzedArticlesByAgent(
        agent.id,
      );

      if (articles.length === 0)
        this.logger.log(
          `Aucun nouvel article a analyser pour l'agent : ${agent.name}.`,
        );

      for (const article of articles) {
        const task = await this.analysis(agent, article);
        if (task) {
          const result = await this.create(task);

          tasks.push(result);
        }
      }
    }
    this.logger.log(
      `Fin  de l'analyse des articles par l'agent : ${agent.name}.`,
    );

    return tasks;
  }

  async analysisAll(): Promise<Task[]> {
    const agents = await this.agentUseCases.getAllAnalysisAgent();
    let results: Task[] = [];
    for (const agent of agents) {
      if (undefined !== agent.id) {
        results = results.concat(await this.analysisAllByOneAgent(agent));
      }
    }

    return results;
  }

  async analysis(agent: AiAgent, article: Article): Promise<Task | null> {
    const aiService = this.aiServiceFactory.create(agent.provider);

    if (agent.role === AiAgentRole.ANALYSIS && aiService.analyzeArticle) {
      const isRelevant = await aiService.analyzeArticle(agent, article);
      this.logger.log(
        `Article "${article.title}" analysé par l'agent "${agent.name}" avec le fournisseur "${agent.provider}".`,
      );

      if (isRelevant) {
        for (const action of agent.actions) {
          if (ActionType.ASSIGN_TO_COLLECTION === action.type) {
            return new Task(
              undefined,
              'name',
              ActionType.ASSIGN_TO_COLLECTION,
              TaskMode.DIRECT,
              {
                articleId: article.id,
                collectionId: action.parameters.collection.id,
              },
              TaskStatus.PENDING,
              new Date(),
              article,
              agent,
            );
          }
        }
      }
    }
  }

  async create(task: Task): Promise<Task> {
    return await this.repository.create(task);
  }

  async saveTasks(tasks: Task[]): Promise<Task[]> {
    return await this.repository.createTasks(tasks);
  }
}
