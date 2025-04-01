import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DriverResponseDto } from 'src/drivers/dto/response-driver.dto';
import { UserResponseDto } from 'src/user/dto/response.dto';
import { VehicleResponseDto } from 'src/vehicles/dto/response-vehicle.dto';
import { ResponseYardDto } from 'src/yards/dto/response-dto';

export class MovementLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  reason: string;

  @ApiProperty({ type: ResponseYardDto })
  yard: ResponseYardDto;

  @ApiPropertyOptional({ type: DriverResponseDto })
  driver: DriverResponseDto;

  @ApiPropertyOptional({ type: VehicleResponseDto })
  vehicle: VehicleResponseDto;

  @ApiProperty({ type: UserResponseDto })
  capturedBy: UserResponseDto;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}
