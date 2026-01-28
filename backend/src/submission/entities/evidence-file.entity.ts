import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Submission } from './submission.entity';

@Entity('evidence_files')
export class EvidenceFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  submission_id: string;

  @ManyToOne(() => Submission)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column()
  file_name: string;

  @Column()
  file_type: string;

  @Column()
  file_url: string;

  @Column({ nullable: true })
  file_size: number;

  @Column()
  indicator_category: string;

  @CreateDateColumn()
  uploaded_at: Date;
}
