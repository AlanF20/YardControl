import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EvidencesService } from './evidences.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { EvidenceResponseDto } from './dto/response-evidence.dto';

@ApiTags('Evidences')
@Controller('evidences')
export class EvidencesController {
  constructor(private readonly evidencesService: EvidencesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new evidence',
    description: 'Creates a new evidence record associated with a movement',
  })
  @ApiBody({
    type: CreateEvidenceDto,
    description: 'Data to create a new evidence record',
  })
  @ApiResponse({
    status: 201,
    description: 'Evidence created successfully',
    type: EvidenceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Movement not found or invalid data',
  })
  async create(
    @Body() createEvidenceDto: CreateEvidenceDto,
  ): Promise<EvidenceResponseDto> {
    return this.evidencesService.create(
      createEvidenceDto,
      createEvidenceDto.userId,
    );
  }

  @Get('movement/:movementId')
  @ApiOperation({
    summary: 'Get evidences by movement',
    description: 'Retrieves all evidences associated with a specific movement',
  })
  @ApiParam({
    name: 'movementId',
    description: 'ID of the movement to retrieve evidences from',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved evidence list',
    type: [EvidenceResponseDto],
  })
  async findByMovement(
    @Param('movementId') movementId: number,
  ): Promise<EvidenceResponseDto[]> {
    return this.evidencesService.findByMovement(movementId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una evidencia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la evidencia a obtener',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Evidencia obtenida exitosamente',
    type: EvidenceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Evidencia no encontrada',
  })
  async findById(@Param('id') id: number): Promise<EvidenceResponseDto> {
    return this.evidencesService.findById(id);
  }
}
