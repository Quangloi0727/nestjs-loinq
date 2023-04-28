import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { LoggerModule } from 'src/libs/log.module'
import { KafkaModule } from 'src/kafka/kafka.module'
import { TenantModule } from 'src/tenant/tenant.module'
import { ConversationModule } from 'src/conversation/conversation.module'
@Module({
  imports: [LoggerModule, KafkaModule, TenantModule, ConversationModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule {}
