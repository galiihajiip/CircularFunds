import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  role: 'UMKM' | 'INVESTOR';

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ default: false })
  kyc_completed: boolean;

  @Column({ default: 'PENDING' })
  kyc_status: string; // PENDING, APPROVED, REJECTED

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
