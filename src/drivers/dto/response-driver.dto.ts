import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  licenseNumber?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  transportCompany?: string;

  @ApiPropertyOptional({ type: Date })
  licenseExpiry?: Date;

  // Añadir estos campos
  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;
}
