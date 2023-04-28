export interface IDataResponse {
    cloudAgentId: number,
    cloudTenantId: number,
    conversationId: string,
    messageType: string,
    text: string,
    attachment: Attachment
}

export class Attachment {
    fileName: string
}