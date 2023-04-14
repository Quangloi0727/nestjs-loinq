import { HttpStatus, Injectable } from '@nestjs/common'
import { LoggerService } from '../libs/log.service'
import { IFormatData } from './interface/format-data.interface'
import { ChannelType, TYPE } from './constants/index.constants'
import { ProducerService } from 'src/kafka/producer.service'
import { TOPIC } from './constants/topic.constants'
@Injectable()
export class WebhookService {
  private readonly _logger
  constructor(
    loggerService: LoggerService,
    private readonly producerService: ProducerService
  ) {
    this._logger = loggerService.getLogger(WebhookService)
  }

  async listenEventFromZalo(body: any) {
    this._logger.info(`Data receive from Zalo is: ${JSON.stringify(body)}`)
    const dataConvert = this.convertDataZalo(body)
    this._logger.info(`Data after convert and send to kafka is: ${JSON.stringify(dataConvert)}`)
    //send data to kafka
    await this.producerService.produce(TOPIC.ACD_MESSAGE_RECEIVED, { value: JSON.stringify(dataConvert) })
    return HttpStatus.OK
  }

  private convertDataZalo(data) {
    const { event_name, app_id, sender, message, timestamp } = data
    const newData: IFormatData = {
      messageId: message?.msg_id ?? 'not found',
      text: message?.text,
      timestamp: Number(timestamp),
      senderId: sender?.id,
      applicationId: app_id,
      channel: ChannelType.ZALO,
      event: event_name,
      media: this.convertMediaType(message.attachments)
    }
    return newData
  }

  private convertMediaType(attachments) {
    if (!attachments) return []
    const newAttachments = attachments.map((el) => {
      const { type } = el
      switch (type) {
        case TYPE.FILE:
          return {
            media: el.payload?.url ?? '',
            fileName: el.payload?.name ?? '',
            size: el.payload?.size ?? '',
            fileType: el.payload?.type ?? '',
            mediaType: el.type
          }
        case TYPE.IMAGE:
        case TYPE.STICKER:
        case TYPE.GIF:
          return {
            media: el.payload?.url ?? '',
            fileName: '',
            size: '',
            fileType: '',
            mediaType: el.type
          }
        case TYPE.LINK:
          return {
            media: el.payload?.description ?? '',
            fileName: el.payload?.thumbnail ?? '',
            size: '',
            fileType: '',
            mediaType: el.type
          }
        default:
          break
      }
    })
    return newAttachments
  }
}

