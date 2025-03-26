import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return this.toUserResponseDto(user);
  }

  @Get()
  @ApiOkResponse({ type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => this.toUserResponseDto(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiParam({ name: 'id', type: Number })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return this.toUserResponseDto(user);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, updateUserDto);
    return this.toUserResponseDto(user);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiParam({ name: 'id', type: Number })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.remove(id);
    return this.toUserResponseDto(user);
  }

  private toUserResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      supervisedYardIds: user.supervisedYards?.map((yard) => yard.id) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
