import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { UserResponseDto } from 'src/user/dto/response.dto';

export class ResponseYardDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'North Yard' })
  name: string;

  @ApiProperty({ example: 'Industrial Zone 5' })
  location: string;

  @ApiProperty({ example: 50 })
  maxCapacity: number;

  @ApiProperty({ enum: Status, example: Status.active })
  status: Status;

  @ApiProperty({ type: UserResponseDto })
  supervisor: UserResponseDto;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
