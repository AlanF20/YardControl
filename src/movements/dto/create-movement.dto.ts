import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { MovementType, EntryReason } from '@prisma/client';
import { CreateVehicleDto } from '../../vehicles/dto/create-vehicle.dto';

export class VehicleInputDto {
  @ApiPropertyOptional({ description: 'Existing vehicle ID' })
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({
    description: 'New vehicle data (required if no ID provided)',
    type: CreateVehicleDto,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVehicleDto)
  data?: CreateVehicleDto;
}

export class CreateMovementLogDto {
  @ApiProperty({ enum: MovementType })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ enum: EntryReason })
  @IsEnum(EntryReason)
  reason: EntryReason;

  @ApiProperty({ example: 1 })
  @IsInt()
  yardId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  driverId?: number;

  @ApiProperty({
    description: 'Vehicle information (ID or full data)',
    type: VehicleInputDto,
  })
  @ValidateNested()
  @Type(() => VehicleInputDto)
  vehicle: VehicleInputDto;

  @ApiProperty({
    example: 1,
    description: 'ID of user who recorded the movement',
  })
  @IsInt()
  capturedById: number;
}
