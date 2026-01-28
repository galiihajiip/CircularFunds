import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessOwnerKyc } from './entities/business-owner-kyc.entity';
import { BusinessFinancial } from './entities/business-financial.entity';
import { LenderKyc } from './entities/lender-kyc.entity';
import { LenderFinancial } from './entities/lender-financial.entity';
import { RdnAccount } from './entities/rdn-account.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(BusinessOwnerKyc)
    private businessKycRepo: Repository<BusinessOwnerKyc>,
    @InjectRepository(BusinessFinancial)
    private businessFinancialRepo: Repository<BusinessFinancial>,
    @InjectRepository(LenderKyc)
    private lenderKycRepo: Repository<LenderKyc>,
    @InjectRepository(LenderFinancial)
    private lenderFinancialRepo: Repository<LenderFinancial>,
    @InjectRepository(RdnAccount)
    private rdnAccountRepo: Repository<RdnAccount>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async submitBusinessOwnerKyc(userId: string, kycData: any, financialData: any) {
    // Save KYC data
    const kyc = this.businessKycRepo.create({
      user_id: userId,
      ...kycData,
    });
    await this.businessKycRepo.save(kyc);

    // Save financial data
    const financial = this.businessFinancialRepo.create({
      user_id: userId,
      ...financialData,
    });
    await this.businessFinancialRepo.save(financial);

    // Update user status
    await this.userRepo.update(userId, {
      kyc_completed: true,
      kyc_status: 'PENDING',
    });

    return { message: 'KYC submitted successfully. Verification will take 1-7 days.' };
  }

  async submitLenderKyc(userId: string, kycData: any, financialData: any) {
    // Save KYC data
    const kyc = this.lenderKycRepo.create({
      user_id: userId,
      ...kycData,
    });
    await this.lenderKycRepo.save(kyc);

    // Save financial data
    const financial = this.lenderFinancialRepo.create({
      user_id: userId,
      ...financialData,
    });
    await this.lenderFinancialRepo.save(financial);

    // Update user status
    await this.userRepo.update(userId, {
      kyc_completed: true,
      kyc_status: 'PENDING',
    });

    return { message: 'KYC submitted successfully. Verification will take 1-7 days.' };
  }

  async getKycStatus(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let kycData = null;
    let financialData = null;

    if (user.role === 'UMKM') {
      kycData = await this.businessKycRepo.findOne({ where: { user_id: userId } });
      financialData = await this.businessFinancialRepo.findOne({ where: { user_id: userId } });
    } else {
      kycData = await this.lenderKycRepo.findOne({ where: { user_id: userId } });
      financialData = await this.lenderFinancialRepo.findOne({ where: { user_id: userId } });
    }

    return {
      kyc_completed: user.kyc_completed,
      kyc_status: user.kyc_status,
      kyc_data: kycData,
      financial_data: financialData,
    };
  }

  async approveKyc(userId: string, adminId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update KYC status
    if (user.role === 'UMKM') {
      await this.businessKycRepo.update(
        { user_id: userId },
        {
          verification_status: 'APPROVED',
          verified_at: new Date(),
          verified_by: adminId,
        },
      );
    } else {
      await this.lenderKycRepo.update(
        { user_id: userId },
        {
          verification_status: 'APPROVED',
          verified_at: new Date(),
          verified_by: adminId,
        },
      );
    }

    // Update user status
    await this.userRepo.update(userId, {
      kyc_status: 'APPROVED',
    });

    // Create RDN account
    await this.createRdnAccount(userId);

    return { message: 'KYC approved successfully' };
  }

  async rejectKyc(userId: string, adminId: string, reason: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update KYC status
    if (user.role === 'UMKM') {
      await this.businessKycRepo.update(
        { user_id: userId },
        {
          verification_status: 'REJECTED',
          rejection_reason: reason,
          verified_by: adminId,
        },
      );
    } else {
      await this.lenderKycRepo.update(
        { user_id: userId },
        {
          verification_status: 'REJECTED',
          rejection_reason: reason,
          verified_by: adminId,
        },
      );
    }

    // Update user status
    await this.userRepo.update(userId, {
      kyc_status: 'REJECTED',
    });

    return { message: 'KYC rejected', reason };
  }

  private async createRdnAccount(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    // Generate account number (simplified - in production use payment gateway API)
    const accountNumber = `RDN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const rdnAccount = this.rdnAccountRepo.create({
      user_id: userId,
      account_number: accountNumber,
      bank_code: 'BCA', // Default bank
      account_name: user.email,
      balance: 0,
      status: 'ACTIVE',
    });

    await this.rdnAccountRepo.save(rdnAccount);

    return rdnAccount;
  }

  async getRdnAccount(userId: string) {
    return this.rdnAccountRepo.findOne({ where: { user_id: userId } });
  }
}
