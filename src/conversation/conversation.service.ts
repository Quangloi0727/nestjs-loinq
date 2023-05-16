import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Conversation, ConversationDocument } from './entities/conversation.entity'

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
  ) { }

  findInfoAppToReply(conversationId) {
    return this.conversationModel.findOne({ _id: conversationId }).lean()
  }
}
