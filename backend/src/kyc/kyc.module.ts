import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { BusinessOwnerKyc } from './entities/business-owner-kyc.entity';
import { BusinessFinancial } from './entities/business-financial.entity';
import { LenderKyc } from './entities/lender-kyc.entity';
import { LenderFinancial } from './entities/lender-financial.entity';
import { RdnAccount } from './entities/rdn-account.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessOwnerKyc,
      BusinessFinancial,
      LenderKyc,
      LenderFinancial,
      RdnAccount,
      User,
    ]),
  ],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
