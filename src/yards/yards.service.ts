import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateYardDto } from './dto/create-yard.dto';
import { UpdateYardDto } from './dto/update-yard.dto';
import { PrismaService } from 'src/db/prisma.service';
import { ResponseYardDto } from './dto/response-dto';
import { YardWithRelations } from 'src/common/definitions';
import { YardFilterDto } from './dto/filter-yard.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class YardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createYardDto: CreateYardDto): Promise<ResponseYardDto> {
    try {
      // Verificar si el supervisor existe
      const supervisor = await this.prisma.user.findUnique({
        where: { id: createYardDto.supervisorId },
      });

      if (!supervisor) {
        throw new NotFoundException(
          `Supervisor with ID ${createYardDto.supervisorId} not found`,
        );
      }

      // Crear la yarda
      const yard = await this.prisma.yard.create({
        data: {
          name: createYardDto.name,
          location: createYardDto.location,
          maxCapacity: createYardDto.maxCapacity,
          status: createYardDto.status,
          supervisorId: createYardDto.supervisorId,
        },
        include: {
          supervisor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              email: true,
            },
          },
        },
      });

      return this.toDtoResponse(yard as YardWithRelations);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Yard name must be unique');
      }
      throw error;
    }
  }

  async findAll(filters?: YardFilterDto): Promise<ResponseYardDto[]> {
    const where: Prisma.YardWhereInput = {};

    // Búsqueda en nombre o ubicación
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filtro por estado
    if (filters?.status) {
      where.status = filters.status;
    }

    // Filtro por supervisor
    if (filters?.supervisorId) {
      where.supervisorId = filters.supervisorId;
    }

    const yards = await this.prisma.yard.findMany({
      where,
      include: { supervisor: true },
    });

    return yards.map((yard) => this.toDtoResponse(yard));
  }

  async findOne(id: number): Promise<ResponseYardDto> {
    const yard = await this.prisma.yard.findUnique({
      where: { id },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
      },
    });

    if (!yard) {
      throw new NotFoundException(`Yard with ID ${id} not found`);
    }

    return this.toDtoResponse(yard as YardWithRelations);
  }

  async update(
    id: number,
    updateYardDto: UpdateYardDto,
  ): Promise<ResponseYardDto> {
    try {
      // Verificar si la yarda existe
      const existingYard = await this.prisma.yard.findUnique({
        where: { id },
      });

      if (!existingYard) {
        throw new NotFoundException(`Yard with ID ${id} not found`);
      }

      // Verificar si el nuevo supervisor existe (si se está actualizando)
      if (updateYardDto.supervisorId) {
        const supervisor = await this.prisma.user.findUnique({
          where: { id: updateYardDto.supervisorId },
        });

        if (!supervisor) {
          throw new NotFoundException(
            `Supervisor with ID ${updateYardDto.supervisorId} not found`,
          );
        }
      }

      // Actualizar la yarda
      const updatedYard = await this.prisma.yard.update({
        where: { id },
        data: {
          name: updateYardDto.name,
          location: updateYardDto.location,
          maxCapacity: updateYardDto.maxCapacity,
          status: updateYardDto.status,
          supervisorId: updateYardDto.supervisorId,
        },
        include: {
          supervisor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              email: true,
            },
          },
        },
      });

      return this.toDtoResponse(updatedYard as YardWithRelations);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Yard name must be unique');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<ResponseYardDto> {
    try {
      // Verificar si la yarda existe
      const yard = await this.prisma.yard.findUnique({
        where: { id },
      });

      if (!yard) {
        throw new NotFoundException(`Yard with ID ${id} not found`);
      }

      // Eliminar la yarda
      const deletedYard = await this.prisma.yard.delete({
        where: { id },
        include: {
          supervisor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              email: true,
            },
          },
        },
      });

      return this.toDtoResponse(deletedYard as YardWithRelations);
    } catch (error) {
      if (error.code === 'P2003') {
        throw new ConflictException(
          'Cannot delete yard because it has related records',
        );
      }
      throw error;
    }
  }

  private toDtoResponse(yard: YardWithRelations): ResponseYardDto {
    return {
      id: yard.id,
      name: yard.name,
      location: yard.location,
      maxCapacity: yard.maxCapacity,
      status: yard.status,
      supervisor: {
        id: yard.supervisor.id,
        firstName: yard.supervisor.firstName,
        lastName: yard.supervisor.lastName,
        email: yard.supervisor.email,
        role: yard.supervisor.role,
      },
      createdAt: yard.createdAt,
      updatedAt: yard.updatedAt,
    };
  }
}
