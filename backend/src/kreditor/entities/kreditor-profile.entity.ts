import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('kreditor_profiles')
export class KreditorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ 
    type: 'varchar',
    nullable: true,
    enum: ['INDIVIDUAL', 'VC', 'CORPORATE', 'NGO']
  })
  kreditor_type: string;

  @Column({ type: 'jsonb', nullable: true })
  focus_sectors: string[];

  @Column({ type: 'jsonb', nullable: true })
  preferred_provinces: string[];

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  min_investment_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  max_investment_amount: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_image_url: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  linkedin: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

