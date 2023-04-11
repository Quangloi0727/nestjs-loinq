import { Module } from '@nestjs/common';
import { FreeswitchService } from './freeswitch.service';
import { FreeswitchController } from './freeswitch.controller';

@Module({
  controllers: [FreeswitchController],
  providers: [FreeswitchService]
})
export class FreeswitchModule {}
