import { Driver, MovementLog, User, Vehicle, Yard } from '@prisma/client';

export type YardWithRelations = Yard & {
  supervisor: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>;
};

export type MovementWithRelations = MovementLog & {
  yard: YardWithRelations;
  driver: Pick<
    Driver,
    | 'id'
    | 'name'
    | 'licenseNumber'
    | 'phone'
    | 'transportCompany'
    | 'licenseExpiry'
  >;
  vehicle: Pick<
    Vehicle,
    'id' | 'plate' | 'serialNumber' | 'keysDelivered' | 'vin' | 'type'
  >;
  capturedBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>;
};
