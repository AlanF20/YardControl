import { User, Yard } from '@prisma/client';

export type YardWithRelations = Yard & {
  supervisor: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>;
};
