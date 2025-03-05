// src/infrastructure/services/yt2doc-docker.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

import { ILogger } from '../../domain/interfaces/logger';
import { ITranscribeVideo } from '../../domain/interfaces/transcribe.video';

const execPromise = promisify(exec);

@Injectable()
export class Yt2docService implements ITranscribeVideo {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
  ) {}

  /**
   * Lance la commande Docker pour exécuter yt2doc et retourne la transcription.
   * @param videoUrl URL de la vidéo YouTube à transcrire.
   * @returns transcription en Markdown.
   */
  async transcribeVideo(videoUrl: string): Promise<string> {
    // La commande docker run avec l'option --rm permet de supprimer le conteneur après exécution.
    const command = `docker run --rm ghcr.io/shun-liang/yt2doc --video ${videoUrl}`;
    this.logger.log(`Exécution de la commande: ${command}`);

    try {
      const { stdout, stderr } = await execPromise(command);
      if (stderr) {
        this.logger.error(`Erreur durant la transcription: ${stderr}`);
      }
      return stdout;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Erreur lors de l'exécution de la commande Docker: ${err.message}`,
      );
    }
  }
}
