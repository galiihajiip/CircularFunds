import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('lender_kyc')
export class LenderKyc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Personal Data
  @Column()
  nama_lengkap: string;

  @Column({ type: 'date' })
  tanggal_lahir: Date;

  @Column()
  tempat_lahir: string;

  @Column({ length: 16 })
  nomor_ktp: string;

  @Column({ length: 15, nullable: true })
  nomor_npwp: string;

  @Column({ type: 'text' })
  alamat_ktp: string;

  @Column({ type: 'text', nullable: true })
  alamat_tinggal: string;

  // Employment
  @Column()
  pekerjaan: string;

  @Column()
  tipe_pekerjaan: string; // tetap, kontrak, tidak tetap, wirausaha

  // Photo URLs
  @Column()
  foto_ktp_url: string;

  @Column()
  foto_diri_url: string;

  @Column()
  foto_pegang_ktp_url: string;

  @Column()
  foto_wajah_kanan_url: string;

  @Column()
  foto_wajah_kiri_url: string;

  // Verification Status
  @Column({ default: 'PENDING' })
  verification_status: string; // PENDING, APPROVED, REJECTED

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @Column({ nullable: true })
  verified_at: Date;

  @Column({ type: 'uuid', nullable: true })
  verified_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
