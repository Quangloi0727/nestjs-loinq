import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { LoggerModule } from '../libs/log.module'
import { KafkaModule } from '../kafka/kafka.module'
import { TenantModule } from '../tenant/tenant.module'
import { ConversationModule } from '../conversation/conversation.module'
import { RedisModule } from 'src/redis/redis.module'
@Module({
  imports: [LoggerModule, KafkaModule, TenantModule, ConversationModule, RedisModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule {}
