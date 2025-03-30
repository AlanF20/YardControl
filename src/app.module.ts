import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { YardsModule } from './yards/yards.module';

@Module({
  imports: [UserModule, YardsModule],
  providers: [],
})
export class AppModule {}
