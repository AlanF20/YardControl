import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDateString, Length } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({ example: 'John Doe', description: 'Driver full name' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'DL-123456',
    description: 'Driver license number (unique)',
  })
  @IsString()
  @IsOptional()
  @Length(6, 50)
  licenseNumber?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Contact phone number',
  })
  @IsString()
  @IsOptional()
  @Length(7, 20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Fast Transports Inc.',
    description: 'Transport company name',
  })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  transportCompany?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'License expiration date',
  })
  @IsDateString()
  @Transform(({ value }) => new Date(value as string).toISOString())
  @IsOptional()
  licenseExpiry?: Date;
}
