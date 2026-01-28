import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('business_owner_kyc')
export class BusinessOwnerKyc {
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

  // Business Data
  @Column()
  nama_usaha: string;

  @Column()
  jenis_usaha: string; // jasa, dagang, manufaktur

  @Column({ type: 'text' })
  alamat_usaha: string;

  @Column({ nullable: true })
  nomor_pendaftaran_usaha: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  maps_latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  maps_longitude: number;

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

  @Column()
  foto_tempat_usaha_url: string;

  @Column()
  foto_operasi_url: string;

  @Column({ nullable: true })
  foto_logo_url: string;

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
