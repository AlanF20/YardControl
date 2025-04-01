import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateMovementLogDto } from './dto/create-movement.dto';
import { MovementLogResponseDto } from './dto/response-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Prisma } from '@prisma/client';
import { MovementWithRelations } from 'src/common/definitions';

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  private includeRelations = {
    yard: {
      include: {
        supervisor: true,
      },
    },
    driver: true,
    vehicle: true,
    capturedBy: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    },
  };

  // CREATE
  async create(
    createDto: CreateMovementLogDto,
  ): Promise<MovementLogResponseDto> {
    return this.handleMovementOperation(createDto, 'create');
  }

  // READ ALL
  async findAll(): Promise<MovementLogResponseDto[]> {
    const movements = await this.prisma.movementLog.findMany({
      include: this.includeRelations,
    });
    return movements.map((m) => this.toResponseDto(m as MovementWithRelations));
  }

  // READ ONE
  async findOne(id: number): Promise<MovementLogResponseDto> {
    const movement = await this.prisma.movementLog.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }

    return this.toResponseDto(movement as MovementWithRelations);
  }

  // UPDATE
  async update(
    id: number,
    updateDto: UpdateMovementDto,
  ): Promise<MovementLogResponseDto> {
    return this.handleMovementOperation(updateDto, 'update', id);
  }

  // DELETE
  async remove(id: number): Promise<MovementLogResponseDto> {
    const movement = await this.prisma.movementLog
      .delete({
        where: { id },
        include: this.includeRelations,
      })
      .catch(() => {
        throw new NotFoundException(`Movement with ID ${id} not found`);
      });

    return this.toResponseDto(movement as MovementWithRelations);
  }

  // HELPER METHODS
  private async handleMovementOperation(
    dto: CreateMovementLogDto | UpdateMovementDto,
    operation: 'create' | 'update',
    id?: number,
  ): Promise<MovementLogResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      // Verify capturedBy user
      const user = await prisma.user.findUnique({
        where: { id: dto.capturedById },
      });
      if (!user)
        throw new NotFoundException(
          `User with ID ${dto.capturedById} not found`,
        );

      // Handle vehicle
      let vehicleId: number | undefined;
      if (dto.vehicle) {
        if (dto.vehicle.id) {
          const existingVehicle = await prisma.vehicle.findUnique({
            where: { id: dto.vehicle.id },
          });
          if (!existingVehicle) {
            throw new NotFoundException(
              `Vehicle with ID ${dto.vehicle.id} not found`,
            );
          }
          vehicleId = dto.vehicle.id;
        } else if (dto.vehicle.data) {
          const newVehicle = await prisma.vehicle.create({
            data: dto.vehicle.data,
          });
          vehicleId = newVehicle.id;
        }
      }

      // Prepare data
      const movementData:
        | Prisma.MovementLogCreateInput
        | Prisma.MovementLogUpdateInput = {
        type: dto.type,
        reason: dto.reason,
        yard: { connect: { id: dto.yardId } },
        capturedBy: { connect: { id: dto.capturedById } },
      };

      // Campos opcionales
      if (dto.driverId !== undefined) {
        Object.assign(movementData, {
          driver: { connect: { id: dto.driverId } },
        });
      }

      if (vehicleId !== undefined) {
        Object.assign(movementData, {
          vehicle: { connect: { id: vehicleId } },
        });
      }

      // Manejar actualización vs creación
      let movement;
      if (operation === 'create') {
        movement = await prisma.movementLog.create({
          data: movementData as Prisma.MovementLogCreateInput,
          include: this.includeRelations,
        });
      } else {
        movement = await prisma.movementLog.update({
          where: { id },
          data: movementData,
          include: this.includeRelations,
        });
      }

      return this.toResponseDto(movement as MovementWithRelations);
    });
  }

  private toResponseDto(
    movement: MovementWithRelations,
  ): MovementLogResponseDto {
    return {
      id: movement.id,
      type: movement.type,
      reason: movement.reason,
      yard: {
        id: movement.yard.id,
        name: movement.yard.name,
        location: movement.yard.location,
        maxCapacity: movement.yard.maxCapacity,
        status: movement.yard.status,
        supervisor: {
          id: movement.yard.supervisor.id,
          firstName: movement.yard.supervisor.firstName,
          lastName: movement.yard.supervisor.lastName,
          email: movement.yard.supervisor.email,
          role: movement.yard.supervisor.role,
        },
        createdAt: movement.yard.createdAt,
        updatedAt: movement.yard.updatedAt,
      },
      driver: {
        id: movement.driver.id,
        name: movement.driver.name,
        licenseNumber: movement.driver.licenseNumber || 'No asignado',
        phone: movement.driver.phone || 'No registrado',
        transportCompany: movement.driver.transportCompany || 'No registrado',
        licenseExpiry: movement.driver.licenseExpiry || undefined,
      },
      vehicle: {
        id: movement.vehicle.id,
        plate: movement.vehicle.plate,
        serialNumber: movement.vehicle.serialNumber,
        keysDelivered: movement.vehicle.keysDelivered,
        vin: movement.vehicle.vin || 'No registrado',
        type: movement.vehicle.type,
      },
      capturedBy: {
        id: movement.capturedBy.id,
        firstName: movement.capturedBy.firstName,
        lastName: movement.capturedBy.lastName,
        email: movement.capturedBy.email,
        role: movement.capturedBy.role,
      },
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    };
  }
}
