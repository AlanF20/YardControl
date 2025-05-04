import { ApiProperty } from '@nestjs/swagger';

export class EvidenceResponseDto {
  @ApiProperty({
    description: 'Unique ID of the evidence',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Descriptive message of the evidence',
    required: false,
    type: String,
  })
  message?: string;

  @ApiProperty({
    description: 'Array of image URLs or paths',
    type: [String],
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    isArray: true,
  })
  images: string[];

  @ApiProperty({
    description: 'User who created the evidence',
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the user',
        example: 1,
      },
      firstName: {
        type: 'string',
        description: 'First name of the user',
        example: 'John',
      },
      lastName: {
        type: 'string',
        description: 'Last name of the user',
        example: 'Doe',
      },
      email: {
        type: 'string',
        description: 'Email of the user',
        example: 'john.doe@example.com',
      },
    },
  })
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Associated movement',
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the movement',
        example: 1,
      },
      type: {
        type: 'string',
        description: 'Type of movement (entry/exit)',
        example: 'entry',
      },
      reason: {
        type: 'string',
        description: 'Reason for the movement',
        example: 'load',
      },
    },
  })
  movement: {
    id: number;
    type: string;
    reason: string;
  };

  @ApiProperty({
    description: 'Creation date of the evidence',
    example: '2025-04-29T22:48:38.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the evidence',
    example: '2025-04-29T22:48:38.000Z',
    type: Date,
  })
  updatedAt: Date;
}
