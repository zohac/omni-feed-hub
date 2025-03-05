export interface ITranscribeVideo {
  transcribeVideo(videoUrl: string): Promise<string>;
}
