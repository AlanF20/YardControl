import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VehicleResponseDto } from './dto/response-vehicle.dto';

@ApiTags('Vehicles Management')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vehicle created successfully',
    type: VehicleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Plate/VIN already exists',
  })
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of vehicles',
    type: [VehicleResponseDto],
  })
  async findAll(): Promise<VehicleResponseDto[]> {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehicle details',
    type: VehicleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle information' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated vehicle details',
    type: VehicleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Plate/VIN already exists',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehicle deleted',
    type: VehicleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.remove(id);
  }
}
