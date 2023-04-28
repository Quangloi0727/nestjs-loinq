import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './libs/log.module'
import { WebhookModule } from './webhook/webhook.module';
import { KafkaModule } from './kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose'
import { TenantModule } from './tenant/tenant.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`${process.cwd()}/config/.env.${process.env.NODE_ENV ?? 'prod'}`] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URI')
      }),
      inject: [ConfigService]
    }),
    WebhookModule,
    LoggerModule,
    KafkaModule,
    TenantModule,
    MessageModule,
    ConversationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
