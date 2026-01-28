import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('lender_financial')
export class LenderFinancial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Income & Expenses
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pemasukan_bulanan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pengeluaran_bulanan: number;

  // Investment Profile
  @Column({ default: true })
  pertama_kali: boolean;

  @Column({ default: 0 })
  jumlah_tanggungan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_aset: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  jumlah_tabungan: number;

  // Debt
  @Column({ default: false })
  memiliki_utang: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  jumlah_utang: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
