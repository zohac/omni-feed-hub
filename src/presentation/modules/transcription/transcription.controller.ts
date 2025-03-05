// src/presentation/modules/transcription/transcription.controller.ts

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { IQueueService } from 'src/domain/interfaces/queue.service';

@Controller('transcription')
export class TranscriptionController {
  constructor(
    @Inject('IQueueService')
    private readonly queueService: IQueueService,
  ) {}

  @ApiOperation({ summary: 'Enqueue a YouTube transcription job' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        videoUrl: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'The URL of the YouTube video to be transcribed.',
        },
      },
      required: ['videoUrl'],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'The YouTube transcription job has been successfully enqueued.',
    schema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          example: '12345',
        },
      },
    },
  })
  @Post()
  async enqueueTranscription(@Body('videoUrl') videoUrl: string) {
    // Utilisation de l'abstraction pour ajouter le job.
    const job = await this.queueService.addJob(
      'transcription',
      { videoUrl },
      { priority: 1 },
    );
    return { jobId: job.id };
  }
}
