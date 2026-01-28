import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KreditorController } from './kreditor.controller';
import { KreditorService } from './kreditor.service';
import { KreditorProfile } from './entities/kreditor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KreditorProfile])],
  controllers: [KreditorController],
  providers: [KreditorService],
  exports: [KreditorService],
})
export class KreditorModule {}


