// src/application/usecases/transcribe.video.use-cases.ts

import { Inject, Injectable } from '@nestjs/common';

import { ILogger } from '../../domain/interfaces/logger';
import { IQueueService } from '../../domain/interfaces/queue.service';
import { ITranscribeVideo } from '../../domain/interfaces/transcribe.video';

import { ArticleUseCases } from './article.use-cases';

@Injectable()
export class TranscriptionUseCases {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    @Inject('ITranscribeVideo')
    private readonly transcribeVideoService: ITranscribeVideo,
    @Inject('IQueueService')
    private readonly transcriptionQueue: IQueueService,
    private readonly articleUseCases: ArticleUseCases,
  ) {}

  async enqueueTranscriptionJobsForArticles(): Promise<void> {
    const articles =
      await this.articleUseCases.getArticlesWithVideoTagToTranscript();
    const pendingJobs =
      await this.transcriptionQueue.getPendingJobs('transcription');

    // Check if there is already a pending job with the same videoUrl
    for (const article of articles) {
      const existingJob = pendingJobs.find(
        (job) => job.data.videoUrl === article.link,
      );

      if (!existingJob) {
        this.logger.log(
          `Enqueue transcription job for article : ${article.id}`,
        );
        // Enqueue du job avec l'URL de la vidéo (supposée stockée dans "article.link")
        await this.addTranscriptionJob(article.id, article.link);
      }
    }
  }

  async addTranscriptionJob(
    articleId: number,
    videoUrl: string,
  ): Promise<void> {
    await this.transcriptionQueue.addJob(
      'transcription',
      { articleId, videoUrl },
      { priority: 5 }, // Priorité faible
    );
  }

  async transcribeVideo(url: string): Promise<string> {
    return await this.transcribeVideoService.transcribeVideo(url);
  }

  async checkTranscriptionJobsFinished(): Promise<void> {
    const completedJobs =
      await this.transcriptionQueue.getCompletedJobs('transcription');

    if (0 < completedJobs.length)
      this.logger.log(`No transcription jobs finished`);

    for (const job of completedJobs) {
      try {
        // Retrieve the result of the completed job
        const transcription: string = job.returnvalue;
        const articleId: number = job.data.articleId;
        const article = await this.articleUseCases.getOneById(articleId);

        console.log('JOB : ', job);
        console.log('Transcription : ', transcription);

        article.content = transcription;
        article.removeTag('to-transcript');
        article.addTag('transcripted');

        this.logger.log(`Transcription finished for article ${articleId}.`);
        // Update the article with the transcribed content
        await this.articleUseCases.updateWithEntity(article);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.logger.error(
          `Error during transcription for article: ${err.message}`,
        );
      }
    }
  }
}
