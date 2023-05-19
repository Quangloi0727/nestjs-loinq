import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createClient } from '@redis/client'
export const redisClient = Symbol('REDIS_CLIENT')
export const redisClientFactory = {
    provide: redisClient,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const client = createClient({
            url: `redis://${configService.get('REDIS_IP')}:${configService.get('REDIS_PORT')}`,
            password: `${configService.get('REDIS_PASSWORD')}`
        })
        await client.connect()
        return client
    }
}

@Module({
    imports: [ConfigModule],
    providers: [redisClientFactory],
    exports: [redisClient],
})

export class RedisModule { }