import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateEvidenceDto {
  @ApiProperty({
    description: 'Descriptive message of the evidence',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Array of image URLs or paths',
    type: [String],
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'ID of the associated movement',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  movementId: number;

  @ApiProperty({
    description: 'ID of the user creating the evidence',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
