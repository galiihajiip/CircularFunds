import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';
import { InvestorProfile } from './entities/investor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorProfile])],
  controllers: [InvestorController],
  providers: [InvestorService],
  exports: [InvestorService],
})
export class InvestorModule {}
