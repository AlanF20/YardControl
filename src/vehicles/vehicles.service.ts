import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/db/prisma.service';
import { VehicleResponseDto } from './dto/response-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.prisma.vehicle.create({
        data: createVehicleDto,
      });
      return this.toResponseDto(vehicle);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vehicle plate or VIN already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.prisma.vehicle.findMany();
    return vehicles.map((vehicle) => this.toResponseDto(vehicle));
  }

  async findOne(id: number): Promise<VehicleResponseDto> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return this.toResponseDto(vehicle);
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.prisma.vehicle.update({
        where: { id },
        data: updateVehicleDto,
      });
      return this.toResponseDto(vehicle);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vehicle plate or VIN already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.prisma.vehicle.delete({
        where: { id },
      });
      return this.toResponseDto(vehicle);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }
      throw error;
    }
  }

  private toResponseDto(vehicle): VehicleResponseDto {
    return {
      id: vehicle.id,
      plate: vehicle.plate,
      serialNumber: vehicle.serialNumber,
      keysDelivered: vehicle.keysDelivered,
      vin: vehicle.vin,
      type: vehicle.type,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }
}
