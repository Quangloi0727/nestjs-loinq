import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { FreeswitchModule } from './freeswitch/freeswitch.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [AuthenticateModule, FreeswitchModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
