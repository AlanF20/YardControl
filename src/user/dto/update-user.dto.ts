import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'new@email.com', required: false })
  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w!@#$%^&*()-+=]{8,}$/, {
    message: 'Password too weak',
  })
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: [3, 7], required: false })
  @IsOptional()
  supervisedYardIds?: number[];
}
