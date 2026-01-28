import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KreditorController } from './investor.controller';
import { KreditorService } from './investor.service';
import { KreditorProfile } from './entities/investor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KreditorProfile])],
  controllers: [KreditorController],
  providers: [KreditorService],
  exports: [KreditorService],
})
export class KreditorModule {}

