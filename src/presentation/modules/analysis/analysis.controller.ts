import { Controller, Param, Post } from '@nestjs/common';

import { AnalysisUseCases } from '../../../application/usecases/analysis.use-cases';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly useCase: AnalysisUseCases) {}

  @Post('/:id/analysed/:agent')
  async articleAnalysedBy(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Param('agent') agent: string,
  ): Promise<void> {
    await this.useCase.articleAnalysedBy(id, agent);
  }
}
