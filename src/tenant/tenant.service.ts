import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { Tenant, TenantDocument } from './entities/tenant.entity'
import { RedisClientType } from '@redis/client'
import { redisClient } from '../redis/redis.module'
import { REDIS_CACHE_TOKEN } from '../conversation/constants/index.constants'

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
    @Inject(redisClient)
    private readonly clientRedis: RedisClientType
  ) { }

  async create(createTenantDto: CreateTenantDto) {
    const data = [createTenantDto]
    await this.clientRedis.set(REDIS_CACHE_TOKEN, JSON.stringify(data))
    const cacheToken = JSON.parse(await this.clientRedis.get(REDIS_CACHE_TOKEN))
    return cacheToken
  }

}
