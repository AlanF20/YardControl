import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum Role {
  admin = 'admin',
  supervisor = 'supervisor',
  operator = 'operator',
}
export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Unique email' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'Password with minimum 8 characters, 1 uppercase, 1 lowercase, 1 number',
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w!@#$%^&*()-+=]{8,}$/, {
    message:
      'Password too weak. Password with minimum 8 characters, 1 uppercase, 1 lowercase, 1 number',
  })
  password: string;

  @ApiProperty({ enum: Role, default: Role.operator, required: false })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    example: [1, 5],
    description: 'IDs of supervised yards',
    required: false,
  })
  @IsOptional()
  supervisedYardIds?: number[];
}
