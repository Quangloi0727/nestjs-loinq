import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { LoggerModule } from 'src/libs/log.module'
import { KafkaModule } from 'src/kafka/kafka.module'
import { TenantModule } from 'src/tenant/tenant.module'
@Module({
  imports: [LoggerModule, KafkaModule, TenantModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule {}
