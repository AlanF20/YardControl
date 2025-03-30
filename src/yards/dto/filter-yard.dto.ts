import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, IsString } from 'class-validator';
import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';

export class YardFilterDto {
  @ApiPropertyOptional({
    example: 'North',
    description: 'Search term for name or location',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: Status, description: 'Filter by yard status' })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({ example: 1, description: 'Filter by supervisor ID' })
  @IsInt()
  @Transform(({ value }) => Number(value)) // Transforma string a number
  @IsOptional()
  supervisorId?: number;
}
