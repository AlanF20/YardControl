import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [DriversController],
  providers: [DriversService, PrismaService],
})
export class DriversModule {}
