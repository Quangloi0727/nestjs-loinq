import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '../libs/log.module'
import { ProducerService } from './producer.service'

@Module({
  imports: [LoggerModule,ConfigModule],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class KafkaModule { }