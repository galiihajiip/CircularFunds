import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('umkm_profiles')
export class UmkmProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  business_name: string;

  @Column()
  sector: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  established_year: number;

  @Column({ nullable: true })
  employee_count: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  cover_image_url: string;

  @Column({ type: 'jsonb', nullable: true })
  product_images: string[];

  @Column({ default: 0 })
  profile_views: number;

  @Column({ default: 0 })
  bookmark_count: number;

  @Column({ nullable: true })
  current_score: number;

  @Column({ default: false })
  is_published: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
