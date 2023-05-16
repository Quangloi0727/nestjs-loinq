import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { UpdateConversationDto } from './dto/update-conversation.dto'
import { Conversation, ConversationDocument } from './entities/conversation.entity'

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
  ) { }
  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation'
  }

  findAll() {
    return `This action returns all conversation`
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`
  }

  findInfoAppToReply(conversationId) {
    return this.conversationModel.findOne({ _id: conversationId }).lean()
  }
}
