import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UmkmController } from './umkm.controller';
import { UmkmService } from './umkm.service';
import { UmkmProfile } from './entities/umkm-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UmkmProfile])],
  controllers: [UmkmController],
  providers: [UmkmService],
  exports: [UmkmService],
})
export class UmkmModule {}
