import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from '@prisma/client';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';

export class VehicleFilterDto {
  @ApiPropertyOptional({ description: 'Search by plate or serial number' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: VehicleType,
    description: 'Filter by vehicle type',
  })
  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @ApiPropertyOptional({ description: 'Filter by keys delivered status' })
  @IsOptional()
  @IsBoolean()
  keysDelivered?: boolean;

  @ApiPropertyOptional({ description: 'Filter by VIN number' })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ description: 'Filter by creation date (start)' })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by creation date (end)' })
  @IsOptional()
  endDate?: Date;
}
