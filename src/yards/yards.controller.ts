import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { YardsService } from './yards.service';
import { CreateYardDto } from './dto/create-yard.dto';
import { UpdateYardDto } from './dto/update-yard.dto';
import { ResponseYardDto } from './dto/response-dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { YardFilterDto } from './dto/filter-yard.dto';

@ApiTags('Yards Management')
@ApiBearerAuth()
@Controller('yards')
export class YardsController {
  constructor(private readonly yardsService: YardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Create a new yard',
    description: 'Creates a new yard with the provided data',
  })
  @ApiBody({ type: CreateYardDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Yard created successfully',
    type: ResponseYardDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supervisor not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Yard name already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(@Body() createYardDto: CreateYardDto): Promise<ResponseYardDto> {
    return this.yardsService.create(createYardDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all yards',
    description: 'Retrieves a list of all yards with optional filtering',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'under_maintenance'],
  })
  @ApiQuery({ name: 'supervisorId', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of yards retrieved successfully',
    type: [ResponseYardDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findAll(@Query() filters?: YardFilterDto): Promise<ResponseYardDto[]> {
    return this.yardsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get yard by ID',
    description: 'Retrieves a single yard by its ID',
  })
  @ApiParam({ name: 'id', description: 'Yard ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Yard retrieved successfully',
    type: ResponseYardDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Yard not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseYardDto> {
    return this.yardsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Update yard',
    description: 'Updates an existing yard with the provided data',
  })
  @ApiParam({ name: 'id', description: 'Yard ID', type: Number })
  @ApiBody({ type: UpdateYardDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Yard updated successfully',
    type: ResponseYardDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Yard or supervisor not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Yard name already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateYardDto: UpdateYardDto,
  ): Promise<ResponseYardDto> {
    return this.yardsService.update(id, updateYardDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete yard',
    description: 'Deletes an existing yard by its ID',
  })
  @ApiParam({ name: 'id', description: 'Yard ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Yard deleted successfully',
    type: ResponseYardDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Yard not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cannot delete yard with related records',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseYardDto> {
    return this.yardsService.remove(id);
  }
}
