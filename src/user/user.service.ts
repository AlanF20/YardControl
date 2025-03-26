import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    try {
      const SALT = 10;
      const hashedPass = await bcrypt.hash(user.password, SALT);

      return await this.prisma.user.create({
        data: {
          ...user,
          password: hashedPass,
          supervisedYards: user.supervisedYardIds
            ? {
                connect: user.supervisedYardIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          supervisedYards: {
            select: { id: true },
          },
        },
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        supervisedYards: {
          select: { id: true },
        },
      },
    });
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          supervisedYards: {
            select: { id: true },
          },
        },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      let hashedPass: string | undefined;

      if (updateUserDto.password) {
        const SALT = 10;
        hashedPass = await bcrypt.hash(updateUserDto.password, SALT);
      }

      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: hashedPass,
          supervisedYards: updateUserDto.supervisedYardIds
            ? {
                set: updateUserDto.supervisedYardIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          supervisedYards: {
            select: { id: true },
          },
        },
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        include: {
          supervisedYards: {
            select: { id: true },
          },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Usuario no encontrado');
        }
        if (err.code === 'P2003') {
          throw new ConflictException(
            'No se puede eliminar, existen dependencias',
          );
        }
      }
      throw new InternalServerErrorException('Error inesperado');
    }
  }

  private handlePrismaError(err: any) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('Email ya registrado');
        case 'P2025':
          throw new NotFoundException('Registro no encontrado');
        case 'P2003':
          throw new BadRequestException(
            'Violación de restricción de clave foránea',
          );
        default:
          throw new BadRequestException(`Error de base de datos: ${err.code}`);
      }
    }
    throw new InternalServerErrorException('Error inesperado');
  }
}
