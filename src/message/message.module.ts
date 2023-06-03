import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from './entities/message.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])
  ]
})
export class MessageModule {}
