// src/application/usecases/analysis.use-cases.ts

import { Inject, Injectable } from '@nestjs/common';

import { AiAgent } from '../../domain/entities/ai-agent';
import { Article } from '../../domain/entities/article';
import { ArticleAnalysis } from '../../domain/entities/article.analyse';
import { Task } from '../../domain/entities/task';
import { AiAgentRole } from '../../domain/enums/ai-agent.role';
import { ArticleAnalysisStatus } from '../../domain/enums/article.analysis.status';
import { TaskMode } from '../../domain/enums/task.mode';
import { IAiServiceFactory } from '../../domain/interfaces/ai-service.factory';
import { ILogger } from '../../domain/interfaces/logger';
import { IRepository } from '../../domain/interfaces/repository';
import { TaskOrchestrator } from '../orchestrators/task.orchestrator';

import { AiAgentUseCases } from './ai-agent.use-cases';
import { ArticleUseCases } from './article.use-cases';

@Injectable()
export class AnalysisUseCases {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    @Inject('IRepository<ArticleAnalysis>')
    private readonly analysisRepository: IRepository<ArticleAnalysis>,
    @Inject('IAiServiceFactory')
    private readonly aiServiceFactory: IAiServiceFactory,
    private readonly articleUseCases: ArticleUseCases,
    private readonly agentUseCases: AiAgentUseCases,
    private readonly taskOrchestrator: TaskOrchestrator,
  ) {}

  async analysisOneArticleWithAgent(
    agentId: number,
    articleId: number,
  ): Promise<Task> {
    const article = await this.articleUseCases.getOneById(articleId);
    const agent = await this.agentUseCases.getOneById(agentId);

    this.logger.log('Start of article analysis.');
    const task = await this.analysis(agent, article);
    this.logger.log('End of article analysis.');

    return await this.taskOrchestrator.create(task);
  }

  async analysisAllByOneAgent(agent: AiAgent): Promise<Task[]> {
    this.logger.log(
      `Start of the analysis of all articles by the agent : ${agent.name}.`,
    );

    let tasks: Task[] = [];

    if (undefined !== agent.id) {
      const articles = await this.articleUseCases.getUnanalyzedArticlesByAgent(
        agent.id,
      );

      if (articles.length === 0)
        this.logger.log(
          `No new articles to analyze for the agent : ${agent.name}.`,
        );

      for (const article of articles) {
        const task = await this.analysis(agent, article);
        if (task) {
          const result = await this.taskOrchestrator.create(task);

          tasks.push(result);

          // Exécuter immédiatement les tâches directes
          if (TaskMode.DIRECT === result.mode) {
            await this.taskOrchestrator.executeTaskDirectly(result);
          }
        }
      }
    }
    this.logger.log(`End of article analysis by the agent : ${agent.name}.`);

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
      const newAnalysis = new ArticleAnalysis(
        undefined,
        article,
        agent,
        ArticleAnalysisStatus.IN_PROGRESS,
        null,
        new Date(),
      );
      const analysis = await this.analysisRepository.create(newAnalysis);

      const response = await aiService.analyzeArticle(agent, article);
      this.logger.log(
        `Article "${article.title}" analyzed by agent "${agent.name}" with provider "${agent.provider}".`,
      );

      let task: Task | null = null;
      if (response.isRelevant) {
        for (const action of agent.actions) {
          task = await this.taskOrchestrator.createNewTask(
            action,
            article,
            agent,
          );
        }
      }

      analysis.result = String(response.isRelevant);
      analysis.status = ArticleAnalysisStatus.COMPLETED;

      if (undefined === response.isRelevant) {
        analysis.result = response.rawResponse;
        analysis.status = ArticleAnalysisStatus.RETRY;
      }

      await this.analysisRepository.update(analysis);

      return task;
    }
  }
}
