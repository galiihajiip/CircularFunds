import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('business_financial')
export class BusinessFinancial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Income & Expenses
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pendapatan_bulanan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pengeluaran_bulanan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  harga_beli_produk: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  harga_jual_produk: number;

  // Separation Questions
  @Column({ default: false })
  listrik_terpisah: boolean;

  @Column({ default: false })
  tempat_berbeda: boolean;

  @Column({ default: false })
  air_terpisah: boolean;

  @Column({ default: false })
  bbm_terpisah: boolean;

  // Savings
  @Column({ default: false })
  kebiasaan_menabung: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  jumlah_tabungan: number;

  // Government Aid
  @Column({ default: false })
  bantuan_pemerintah: boolean;

  @Column({ type: 'text', nullable: true })
  jenis_bantuan: string;

  // Other Income
  @Column({ default: false })
  penghasilan_lain: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  jumlah_penghasilan_lain: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
