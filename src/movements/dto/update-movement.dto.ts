import { PartialType } from '@nestjs/swagger';
import { CreateMovementLogDto } from './create-movement.dto';

export class UpdateMovementDto extends PartialType(CreateMovementLogDto) {}
