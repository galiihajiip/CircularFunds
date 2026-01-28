import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() body: { umkmId: string; data: any }) {
    return this.submissionService.create(body.umkmId, body.data);
  }

  @Get('umkm/:umkmId')
  findAll(@Param('umkmId') umkmId: string) {
    return this.submissionService.findAll(umkmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Post(':id/evidence')
  addEvidence(@Param('id') id: string, @Body() evidenceData: any) {
    return this.submissionService.addEvidence(id, evidenceData);
  }

  @Get(':id/evidence')
  getEvidence(@Param('id') id: string) {
    return this.submissionService.getEvidence(id);
  }
}
