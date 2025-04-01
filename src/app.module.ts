import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { YardsModule } from './yards/yards.module';
import { MovementsModule } from './movements/movements.module';
import { DriversModule } from './drivers/drivers.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [UserModule, YardsModule, MovementsModule, DriversModule, VehiclesModule],
  providers: [],
})
export class AppModule {}
