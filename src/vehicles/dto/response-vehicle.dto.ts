import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from '@prisma/client';

export class VehicleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  plate: string;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  keysDelivered: boolean;

  @ApiPropertyOptional()
  vin?: string;

  @ApiProperty({ enum: VehicleType })
  type: VehicleType;

  // Añadir estos campos
  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;
}
