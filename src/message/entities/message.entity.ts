import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

export type MessageDocument = Message & Document

@Schema({ collection: 'message' })
export class Message {
    @Prop()
    conversationId:string

    @Prop()
    senderId: string

    @Prop()
    applicationId: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)