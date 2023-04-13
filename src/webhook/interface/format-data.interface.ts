import { ChannelType } from "../constants/index.constants"

export interface IFormatData {
    messageId: string,
    text: string,
    timestamp: number,
    senderId: string,
    applicationId: string,
    channel: ChannelType,
    event: string,
    media: []
}