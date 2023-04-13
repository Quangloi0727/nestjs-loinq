import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './libs/log.module'
import { WebhookModule } from './webhook/webhook.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`${process.cwd()}/config/.env.${process.env.NODE_ENV ?? 'prod'}`] }),
    WebhookModule,
    LoggerModule,
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
