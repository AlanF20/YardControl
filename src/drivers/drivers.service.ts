import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from 'src/db/prisma.service';
import { DriverResponseDto } from './dto/response-driver.dto';
import { Driver } from '@prisma/client';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto): Promise<DriverResponseDto> {
    try {
      const driver = await this.prisma.driver.create({
        data: createDriverDto,
      });
      return this.toResponseDto(driver);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('License number already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<DriverResponseDto[]> {
    const drivers = await this.prisma.driver.findMany();
    return drivers.map((driver) => this.toResponseDto(driver));
  }

  async findOne(id: number): Promise<DriverResponseDto> {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return this.toResponseDto(driver);
  }

  async update(
    id: number,
    updateDriverDto: UpdateDriverDto,
  ): Promise<DriverResponseDto> {
    try {
      const driver = await this.prisma.driver.update({
        where: { id },
        data: updateDriverDto,
      });
      return this.toResponseDto(driver);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('License number already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<DriverResponseDto> {
    try {
      const driver = await this.prisma.driver.delete({
        where: { id },
      });
      return this.toResponseDto(driver);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      throw error;
    }
  }

  private toResponseDto(driver): DriverResponseDto {
    return {
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
      transportCompany: driver.transportCompany,
      licenseExpiry: driver.licenseExpiry,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}
