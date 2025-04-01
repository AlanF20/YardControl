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
  Query,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMovementLogDto } from './dto/create-movement.dto';
import { MovementLogResponseDto } from './dto/response-movement.dto';
import { MovementType } from '@prisma/client';
import { UpdateMovementDto } from './dto/update-movement.dto';

@ApiTags('Movements Management')
@ApiBearerAuth()
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new movement log' })
  @ApiBody({ type: CreateMovementLogDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movement created successfully',
    type: MovementLogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User/Vehicle/Yard not found',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Validation error' })
  async create(
    @Body() createDto: CreateMovementLogDto,
  ): Promise<MovementLogResponseDto> {
    return this.movementsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movement logs' })
  @ApiQuery({ name: 'yardId', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['entry', 'exit'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of movements retrieved',
    type: [MovementLogResponseDto],
  })
  async findAll(): Promise<MovementLogResponseDto[]> {
    return this.movementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movement log by ID' })
  @ApiParam({ name: 'id', description: 'Movement ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movement details',
    type: MovementLogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movement not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovementLogResponseDto> {
    return this.movementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update movement log' })
  @ApiParam({ name: 'id', description: 'Movement ID', type: Number })
  @ApiBody({ type: UpdateMovementDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated movement details',
    type: MovementLogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resource not found',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Validation error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMovementDto,
  ): Promise<MovementLogResponseDto> {
    return this.movementsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete movement log' })
  @ApiParam({ name: 'id', description: 'Movement ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted movement details',
    type: MovementLogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movement not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovementLogResponseDto> {
    return this.movementsService.remove(id);
  }
}
