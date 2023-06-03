import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

export type ConversationDocument = Conversation & Document

@Schema({ collection: 'conversation_test' })
export class Conversation {
    @Prop()
    senderId: string

    @Prop()
    applicationId: string
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)