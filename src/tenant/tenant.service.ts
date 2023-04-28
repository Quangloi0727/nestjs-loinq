import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { Tenant, TenantDocument } from './entities/tenant.entity'

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
  ) { }

  create(createTenantDto: CreateTenantDto) {
    return 'This action adds a new tenant'
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
