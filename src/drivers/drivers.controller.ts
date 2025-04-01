import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { DriverResponseDto } from './dto/response-driver.dto';

@ApiTags('Drivers Management')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiBody({ type: CreateDriverDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Driver created successfully',
    type: DriverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'License number already exists',
  })
  async create(
    @Body() createDriverDto: CreateDriverDto,
  ): Promise<DriverResponseDto> {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of drivers retrieved successfully',
    type: [DriverResponseDto],
  })
  async findAll(): Promise<DriverResponseDto[]> {
    return this.driversService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Driver ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver retrieved successfully',
    type: DriverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Driver not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DriverResponseDto> {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update driver information' })
  @ApiParam({ name: 'id', type: Number, description: 'Driver ID' })
  @ApiBody({ type: UpdateDriverDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver updated successfully',
    type: DriverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Driver not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'License number already exists',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ): Promise<DriverResponseDto> {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a driver' })
  @ApiParam({ name: 'id', type: Number, description: 'Driver ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver deleted successfully',
    type: DriverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Driver not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DriverResponseDto> {
    return this.driversService.remove(id);
  }
}
