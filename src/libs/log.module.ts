import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerService } from '../libs/log.service'

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [LoggerService],
    exports: [LoggerService]
})

export class LoggerModule { }
