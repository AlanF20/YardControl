import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { EvidenceResponseDto } from './dto/response-evidence.dto';
import { Evidence, MovementType, EntryReason } from '@prisma/client';

// Type for Evidence with its relations
interface EvidenceWithRelations extends Evidence {
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  movement?: {
    id: number;
    type: MovementType;
    reason: EntryReason;
  };
}

@Injectable()
export class EvidencesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEvidenceDto: CreateEvidenceDto,
    userId: number,
  ): Promise<EvidenceResponseDto> {
    const evidence = (await this.prisma.evidence.create({
      data: {
        message: createEvidenceDto.message,
        images: createEvidenceDto.images,
        createdBy: { connect: { id: userId } },
        movement: { connect: { id: createEvidenceDto.movementId } },
      },
      include: {
        createdBy: true,
        movement: true,
      },
    })) as EvidenceWithRelations;

    return this.toResponseDto(evidence);
  }

  /**
   * Retrieves all evidences associated with a specific movement
   * @param movementId ID of the movement to retrieve evidences from
   * @returns Array of evidences with their relations
   */
  async findByMovement(movementId: number): Promise<EvidenceResponseDto[]> {
    const movement = await this.prisma.movementLog.findUnique({
      where: { id: movementId },
      include: {
        evidences: {
          include: {
            createdBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!movement) {
      throw new NotFoundException(`Movement with ID ${movementId} not found`);
    }

    return movement.evidences.map((evidence) => this.toResponseDto(evidence));
  }

  /**
   * Retrieves an evidence by its ID
   * @param id ID of the evidence to retrieve
   * @returns Evidence with its relations
   */
  async findById(id: number): Promise<EvidenceResponseDto> {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id },
      include: {
        createdBy: true,
      },
    });

    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }

    return this.toResponseDto(evidence);
  }

  /**
   * Converts a Prisma evidence object to a response DTO format
   * @param evidence Evidence object from Prisma
   * @returns EvidenceResponseDto with formatted data
   */
  private toResponseDto(evidence: EvidenceWithRelations): EvidenceResponseDto {
    return {
      id: evidence.id,
      message: evidence.message || '',
      images: evidence.images || [],
      createdBy: {
        id: evidence.createdById,
        firstName: evidence.createdBy?.firstName || '',
        lastName: evidence.createdBy?.lastName || '',
      },
      movement: {
        id: evidence.movement?.id || 0,
        type: evidence.movement?.type || 'entry',
        reason: evidence.movement?.reason || 'load',
      },
      createdAt: evidence.createdAt,
      updatedAt: evidence.updatedAt,
    } as EvidenceResponseDto;
  }
}
