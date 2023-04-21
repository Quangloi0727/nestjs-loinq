import { ChannelType } from "../constants/index.constants"

export interface IFormatData {
    messageId: string,
    text: string,
    timestamp: number,
    senderId: string,
    senderName: string,
    applicationId: string,
    channel: ChannelType,
    event: string,
    media: any
}