import { Module } from '@nestjs/common'
import { TenantService } from './tenant.service'
import { TenantController } from './tenant.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Tenant, TenantSchema } from './entities/tenant.entity'
import { RedisModule } from 'src/redis/redis.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    RedisModule
  ],
  controllers: [TenantController],
  providers: [TenantService ],
  exports: [TenantService]
})
export class TenantModule { }
