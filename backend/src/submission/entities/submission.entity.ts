import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UmkmProfile } from '../../umkm/entities/umkm-profile.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  umkm_id: string;

  @ManyToOne(() => UmkmProfile)
  @JoinColumn({ name: 'umkm_id' })
  umkm: UmkmProfile;

  @CreateDateColumn()
  submission_date: Date;

  @Column({ default: 'PENDING' })
  status: string;

  // Operational Circularity
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  resource_reduction_percentage: number;

  @Column({ type: 'text', nullable: true })
  resource_reduction_details: string;

  @Column({ nullable: true })
  reuse_frequency: string;

  @Column({ type: 'text', nullable: true })
  reuse_details: string;

  @Column({ nullable: true })
  recycle_type: string;

  @Column({ type: 'text', nullable: true })
  recycle_details: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  product_lifespan_years: number;

  @Column({ nullable: true })
  product_repairability: boolean;

  @Column({ type: 'text', nullable: true })
  product_details: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  process_efficiency_improvement: number;

  @Column({ type: 'text', nullable: true })
  process_details: string;

  // Ethics & Governance
  @Column({ nullable: true })
  documentation_level: string;

  @Column({ nullable: true })
  traceability_system: boolean;

  // Impact Proxy
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carbon_reduction_kg: number;

  @Column({ nullable: true })
  carbon_calculation_method: string;

  @Column({ nullable: true })
  local_employees: number;

  @Column({ nullable: true })
  income_stability: string;

  @Column({ default: false })
  is_baseline: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
