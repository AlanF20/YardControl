import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateYardDto } from './create-yard.dto';
import { IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateYardDto extends PartialType(CreateYardDto) {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  maxCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  supervisorId?: number;
}
