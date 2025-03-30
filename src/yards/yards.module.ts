import { Module } from '@nestjs/common';
import { YardsService } from './yards.service';
import { YardsController } from './yards.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [YardsController],
  providers: [YardsService, PrismaService],
})
export class YardsModule {}
