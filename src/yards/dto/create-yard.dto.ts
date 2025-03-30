import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateYardDto {
  @ApiProperty({ example: 'North Yard', description: 'Yard name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Industrial Zone 5',
    description: 'Physical location',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  location: string;

  @ApiProperty({ example: 50, description: 'Maximum vehicle capacity' })
  @IsInt()
  @IsNotEmpty()
  maxCapacity: number;

  @ApiProperty({ enum: Status, example: Status.active })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({ example: 1, description: 'ID of supervising user' })
  @IsInt()
  @IsNotEmpty()
  supervisorId: number;
}
