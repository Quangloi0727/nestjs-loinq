import { Injectable } from '@nestjs/common'
import { CreateFreeswitchDto } from './dto/create-freeswitch.dto'
import { UpdateFreeswitchDto } from './dto/update-freeswitch.dto'

@Injectable()
export class FreeswitchService {
  create(createFreeswitchDto: CreateFreeswitchDto) {
    console.log(1111, createFreeswitchDto)

    return 'This action adds a new freeswitch'
  }

  findAll() {
    return `This action returns all freeswitch`
  }

  findOne(id: number) {
    return `This action returns a #${id} freeswitch`
  }

  update(id: number, updateFreeswitchDto: UpdateFreeswitchDto) {
    return `This action updates a #${id} freeswitch`
  }

  remove(id: number) {
    return `This action removes a #${id} freeswitch`
  }
}
