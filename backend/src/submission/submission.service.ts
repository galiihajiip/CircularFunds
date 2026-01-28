import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { EvidenceFile } from './entities/evidence-file.entity';
import { ScoringService } from '../scoring/scoring.service';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(EvidenceFile)
    private evidenceRepository: Repository<EvidenceFile>,
    private scoringService: ScoringService,
  ) {}

  async create(umkmId: string, submissionData: any) {
    const submission = this.submissionRepository.create({
      umkm_id: umkmId,
      ...submissionData,
      status: 'PENDING',
    });

    const result = await this.submissionRepository.save(submission);
    const savedSubmission = result as unknown as Submission;

    // Trigger scoring asynchronously after save
    this.processScoring(savedSubmission.id, submissionData).catch((err) =>
      console.error('Scoring error:', err),
    );

    return savedSubmission;
  }

  async findAll(umkmId: string) {
    return this.submissionRepository.find({
      where: { umkm_id: umkmId },
      order: { submission_date: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.submissionRepository.findOne({
      where: { id },
      relations: ['umkm'],
    });
  }

  async addEvidence(submissionId: string, evidenceData: any) {
    const evidence = this.evidenceRepository.create({
      submission_id: submissionId,
      ...evidenceData,
    });

    return this.evidenceRepository.save(evidence);
  }

  async getEvidence(submissionId: string) {
    return this.evidenceRepository.find({
      where: { submission_id: submissionId },
    });
  }

  private async processScoring(submissionId: string, data: any) {
    try {
      const submission = await this.submissionRepository.findOne({
        where: { id: submissionId },
      });

      if (!submission) return;

      // Calculate score
      const scoreResult =
        await this.scoringService.calculateCircularReadinessScore(data);

      // Save score to database
      await this.scoringService.saveScore(
        submissionId,
        submission.umkm_id,
        scoreResult,
      );

      // Update submission status
      submission.status = 'SCORED';
      await this.submissionRepository.save(submission);
      
    } catch (error) {
      console.error('Scoring error:', error);
      const submission = await this.submissionRepository.findOne({
        where: { id: submissionId },
      });
      if (submission) {
        submission.status = 'FLAGGED';
        await this.submissionRepository.save(submission);
      }
    }
  }
}
