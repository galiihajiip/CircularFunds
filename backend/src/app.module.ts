import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UmkmModule } from './umkm/umkm.module';
import { InvestorModule } from './investor/investor.module';
import { ScoringModule } from './scoring/scoring.module';
import { SubmissionModule } from './submission/submission.module';
import { FileModule } from './file/file.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'circularfund',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UmkmModule,
    InvestorModule,
    ScoringModule,
    SubmissionModule,
    FileModule,
    KycModule,
  ],
})
export class AppModule {}
