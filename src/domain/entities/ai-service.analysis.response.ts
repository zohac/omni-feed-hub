export class AiServiceAnalysisResponse {
  constructor(
    public isRelevant: boolean | undefined,
    public rawResponse: string,
  ) {}
}
