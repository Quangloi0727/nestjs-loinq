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

  findAll() {
    return `This action returns all tenant`
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`
  }

  async findTokenByAppId(applicationId) {
    const findToken = await this.tenantModel.findOne({ applicationIds: applicationId })
    if (!findToken) return ''
    return findToken.configs[applicationId]['pageAccessToken']
  }

}
