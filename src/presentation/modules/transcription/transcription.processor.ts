import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';

import { TranscriptionUseCases } from 'src/application/usecases/transcription.use-cases';
import { ILogger } from 'src/domain/interfaces/logger';
import { ArticleUseCases } from '../../../application/usecases/article.use-cases';

@Processor('transcription')
export class TranscriptionProcessor {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly useCases: TranscriptionUseCases,
    private readonly articleUseCases: ArticleUseCases,
  ) {}

  @Process({ concurrency: 1 })
  async handleTranscriptionJob(
    job: Job<{ articleId: number; videoUrl: string }>,
  ) {
    this.logger.log(
      `Traitement du job ${job.id} pour la vidéo ${job.data.videoUrl}`,
    );
    try {
      await this.articleUseCases.getOneById(job.data.articleId);
      const transcription = await this.useCases.transcribeVideo(
        job.data.videoUrl,
      );
      this.logger.log(`Job ${job.id} terminé.`);
      // Ici, vous pouvez sauvegarder le résultat ou l'envoyer à une autre partie de votre application.
      return transcription;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Erreur sur le job ${job.id}: ${err.message}`);
      throw error;
    }
  }
}
