import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UmkmProfile } from '../../umkm/entities/umkm-profile.entity';
import { Submission } from '../../submission/entities/submission.entity';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  submission_id: string;

  @ManyToOne(() => Submission)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ type: 'uuid' })
  umkm_id: string;

  @ManyToOne(() => UmkmProfile)
  @JoinColumn({ name: 'umkm_id' })
  umkm: UmkmProfile;

  @Column()
  total_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  operational_circularity_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  ethics_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  impact_score: number;

  // Indicator breakdown
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  resource_reduction_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  resource_reduction_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  reuse_practice_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  reuse_practice_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  recycle_integration_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  recycle_integration_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  product_durability_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  product_durability_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  process_efficiency_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  process_efficiency_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  transparency_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  transparency_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  carbon_avoidance_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  carbon_avoidance_confidence: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  livelihood_impact_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  livelihood_impact_confidence: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  ai_overall_confidence: number;

  @Column({ type: 'jsonb', nullable: true })
  ai_flags: string[];

  @Column()
  recommendation: string;

  @CreateDateColumn()
  scored_at: Date;
}
