import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VehicleType } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Camión Grande', description: 'Nombre del vehículo' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'ABC-123', description: 'License plate' })
  @IsString()
  @Length(5, 20)
  plate: string;

  @ApiProperty({ example: 'SN-2024', description: 'Vehicle serial number' })
  @IsString()
  @Length(3, 50)
  serialNumber: string;

  @ApiProperty({
    example: false,
    description: 'Keys delivered status',
    default: false,
  })
  @IsBoolean()
  keysDelivered: boolean;

  @ApiPropertyOptional({
    example: '1HGBH41JXMN109186',
    description: 'Vehicle Identification Number',
  })
  @IsString()
  @Length(17, 17)
  @IsOptional()
  vin?: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.truck })
  @IsEnum(VehicleType)
  type: VehicleType;
}
