import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Score } from './entities/score.entity';

export interface SubmissionData {
  resourceReductionPercentage?: number;
  reuseFrequency?: string;
  recycleType?: string;
  productLifespanYears?: number;
  productRepairability?: boolean;
  processEfficiencyImprovement?: number;
  documentationLevel?: string;
  traceabilitySystem?: boolean;
  carbonReductionKg?: number;
  localEmployees?: number;
  incomeStability?: string;
}

export interface ScoreBreakdown {
  score: number;
  confidence: number;
}

export interface ScoringResult {
  totalScore: number;
  breakdown: {
    operationalCircularity: number;
    ethics: number;
    impact: number;
  };
  indicators: {
    resourceReduction: ScoreBreakdown;
    reusePractice: ScoreBreakdown;
    recycleIntegration: ScoreBreakdown;
    productDurability: ScoreBreakdown;
    processEfficiency: ScoreBreakdown;
    transparency: ScoreBreakdown;
    carbonAvoidance: ScoreBreakdown;
    livelihoodImpact: ScoreBreakdown;
  };
  flags: string[];
  recommendation: string;
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';

  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
  ) {}

  async calculateCircularReadinessScore(data: SubmissionData): Promise<ScoringResult> {
    const indicators = {
      resourceReduction: this.scoreResourceReduction(data.resourceReductionPercentage),
      reusePractice: this.scoreReusePractice(data.reuseFrequency),
      recycleIntegration: this.scoreRecycleIntegration(data.recycleType),
      productDurability: this.scoreProductDurability(data.productLifespanYears, data.productRepairability),
      processEfficiency: this.scoreProcessEfficiency(data.processEfficiencyImprovement),
      transparency: this.scoreTransparency(data.documentationLevel, data.traceabilitySystem),
      carbonAvoidance: this.scoreCarbonAvoidance(data.carbonReductionKg),
      livelihoodImpact: this.scoreLivelihoodImpact(data.localEmployees, data.incomeStability),
    };

    const operationalCircularity = 
      indicators.resourceReduction.score +
      indicators.reusePractice.score +
      indicators.recycleIntegration.score +
      indicators.productDurability.score +
      indicators.processEfficiency.score;

    const ethics = indicators.transparency.score;
    const impact = indicators.carbonAvoidance.score + indicators.livelihoodImpact.score;
    let totalScore = Math.round(operationalCircularity + ethics + impact);
    let flags = this.detectAnomalies(data, indicators);

    // Call Python AI service for validation
    try {
      const aiValidation = await this.validateWithAI(data);
      
      // Apply AI adjustments
      if (aiValidation.adjustedScores) {
        Object.entries(aiValidation.adjustedScores).forEach(([key, adjustment]) => {
          if (indicators[key]) {
            indicators[key].score = Math.max(0, indicators[key].score + adjustment);
          }
        });
        
        // Recalculate total
        totalScore = Math.round(
          indicators.resourceReduction.score +
          indicators.reusePractice.score +
          indicators.recycleIntegration.score +
          indicators.productDurability.score +
          indicators.processEfficiency.score +
          indicators.transparency.score +
          indicators.carbonAvoidance.score +
          indicators.livelihoodImpact.score
        );
      }
      
      // Merge AI flags
      flags = [...flags, ...aiValidation.flags];
      
      this.logger.log(`AI validation confidence: ${aiValidation.confidence}`);
    } catch (error) {
      this.logger.warn('AI service unavailable, using rule-based scoring only');
    }

    const recommendation = this.getRecommendation(totalScore);

    return {
      totalScore,
      breakdown: {
        operationalCircularity: Math.round(operationalCircularity),
        ethics: Math.round(ethics),
        impact: Math.round(impact),
      },
      indicators,
      flags,
      recommendation,
    };
  }

  private scoreResourceReduction(percentage?: number): ScoreBreakdown {
    if (!percentage) return { score: 0, confidence: 0.5 };
    
    let score = 0;
    if (percentage > 25) score = 15;
    else if (percentage >= 15) score = 11;
    else if (percentage >= 5) score = 7;
    else if (percentage > 0) score = 3;

    return { score, confidence: 0.85 };
  }

  private scoreReusePractice(frequency?: string): ScoreBreakdown {
    if (!frequency) return { score: 0, confidence: 0.5 };

    const frequencyMap: { [key: string]: number } = {
      'none': 0,
      'occasional': 5,
      'regular': 10,
      'systematic': 15,
    };

    const score = frequencyMap[frequency.toLowerCase()] || 0;
    return { score, confidence: 0.9 };
  }

  private scoreRecycleIntegration(type?: string): ScoreBreakdown {
    if (!type) return { score: 0, confidence: 0.5 };

    const typeMap: { [key: string]: number } = {
      'none': 0,
      'partner': 5,
      'internal': 10,
    };

    const score = typeMap[type.toLowerCase()] || 0;
    return { score, confidence: 0.85 };
  }

  private scoreProductDurability(lifespan?: number, repairable?: boolean): ScoreBreakdown {
    if (!lifespan) return { score: 0, confidence: 0.5 };

    let score = 0;
    if (lifespan > 3 && repairable) score = 10;
    else if (lifespan >= 1 && lifespan <= 3) score = 6;
    else if (lifespan < 1 && lifespan > 0) score = 3;

    return { score, confidence: 0.8 };
  }

  private scoreProcessEfficiency(improvement?: number): ScoreBreakdown {
    if (!improvement) return { score: 0, confidence: 0.5 };

    let score = 0;
    if (improvement > 30) score = 10;
    else if (improvement >= 15) score = 7;
    else if (improvement >= 5) score = 4;

    return { score, confidence: 0.75 };
  }

  private scoreTransparency(level?: string, hasTraceability?: boolean): ScoreBreakdown {
    if (!level) return { score: 0, confidence: 0.5 };

    const levelMap: { [key: string]: number } = {
      'minimal': 3,
      'basic': 7,
      'comprehensive': 12,
      'full': 15,
    };

    let score = levelMap[level.toLowerCase()] || 0;
    if (hasTraceability && score < 15) score = Math.min(score + 3, 15);

    return { score, confidence: 0.9 };
  }

  private scoreCarbonAvoidance(carbonKg?: number): ScoreBreakdown {
    if (!carbonKg) return { score: 0, confidence: 0.5 };

    let score = 0;
    if (carbonKg > 1000) score = 15;
    else if (carbonKg >= 500) score = 11;
    else if (carbonKg >= 100) score = 7;
    else if (carbonKg > 0) score = 3;

    return { score, confidence: 0.7 };
  }

  private scoreLivelihoodImpact(employees?: number, stability?: string): ScoreBreakdown {
    if (!employees) return { score: 0, confidence: 0.5 };

    let score = 0;
    if (employees > 5 && stability === 'stable') score = 10;
    else if (employees >= 3 && employees <= 5) score = 6;
    else if (employees >= 1 && employees <= 2) score = 3;

    return { score, confidence: 0.85 };
  }

  private detectAnomalies(data: SubmissionData, indicators: any): string[] {
    const flags: string[] = [];

    if (data.carbonReductionKg && data.carbonReductionKg > 5000) {
      flags.push('High carbon reduction claim - verify evidence');
    }

    if (data.resourceReductionPercentage && data.resourceReductionPercentage > 50) {
      flags.push('Unusually high resource reduction - needs validation');
    }

    if (indicators.transparency.score < 7 && indicators.resourceReduction.score > 10) {
      flags.push('High operational score with low documentation - inconsistent');
    }

    return flags;
  }

  private getRecommendation(totalScore: number): string {
    if (totalScore >= 80) return 'High Circular Potential';
    if (totalScore >= 60) return 'Ready';
    if (totalScore >= 40) return 'Developing';
    return 'Low Readiness';
  }

  async saveScore(submissionId: string, umkmId: string, result: ScoringResult): Promise<Score> {
    const score = this.scoreRepository.create({
      submission_id: submissionId,
      umkm_id: umkmId,
      total_score: result.totalScore,
      operational_circularity_score: result.breakdown.operationalCircularity,
      ethics_score: result.breakdown.ethics,
      impact_score: result.breakdown.impact,
      resource_reduction_score: result.indicators.resourceReduction.score,
      resource_reduction_confidence: result.indicators.resourceReduction.confidence,
      reuse_practice_score: result.indicators.reusePractice.score,
      reuse_practice_confidence: result.indicators.reusePractice.confidence,
      recycle_integration_score: result.indicators.recycleIntegration.score,
      recycle_integration_confidence: result.indicators.recycleIntegration.confidence,
      product_durability_score: result.indicators.productDurability.score,
      product_durability_confidence: result.indicators.productDurability.confidence,
      process_efficiency_score: result.indicators.processEfficiency.score,
      process_efficiency_confidence: result.indicators.processEfficiency.confidence,
      transparency_score: result.indicators.transparency.score,
      transparency_confidence: result.indicators.transparency.confidence,
      carbon_avoidance_score: result.indicators.carbonAvoidance.score,
      carbon_avoidance_confidence: result.indicators.carbonAvoidance.confidence,
      livelihood_impact_score: result.indicators.livelihoodImpact.score,
      livelihood_impact_confidence: result.indicators.livelihoodImpact.confidence,
      ai_overall_confidence: 0.85,
      ai_flags: result.flags,
      recommendation: result.recommendation,
    });

    return this.scoreRepository.save(score);
  }

  async getScoreHistory(umkmId: string): Promise<Score[]> {
    return this.scoreRepository.find({
      where: { umkm_id: umkmId },
      order: { scored_at: 'DESC' },
    });
  }

  async getLatestScore(umkmId: string): Promise<Score | null> {
    return this.scoreRepository.findOne({
      where: { umkm_id: umkmId },
      order: { scored_at: 'DESC' },
    });
  }

  private async validateWithAI(data: SubmissionData): Promise<any> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/validate`, data, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to call AI service', error);
      throw error;
    }
  }
}
