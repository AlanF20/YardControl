import { Module } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { EvidencesController } from './evidences.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [EvidencesController],
  providers: [EvidencesService, PrismaService],
  exports: [EvidencesService],
})
export class EvidencesModule {}
