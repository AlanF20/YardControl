import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [MovementsController],
  providers: [MovementsService, PrismaService],
})
export class MovementsModule {}
