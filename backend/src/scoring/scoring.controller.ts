import { Controller, Post, Body } from '@nestjs/common';
import { ScoringService, SubmissionData, ScoringResult } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('calculate')
  async calculateScore(@Body() submissionData: SubmissionData): Promise<ScoringResult> {
    return this.scoringService.calculateCircularReadinessScore(submissionData);
  }
}
