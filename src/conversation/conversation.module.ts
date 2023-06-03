import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose'
import { Conversation, ConversationSchema } from './entities/conversation.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])
  ],
  providers: [ConversationService],
  exports: [ConversationService]
})
export class ConversationModule {}
