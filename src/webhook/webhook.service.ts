import { HttpStatus, Injectable } from '@nestjs/common'
import { LoggerService } from '../libs/log.service'
import { IFormatData } from './interface/format-data.interface'
import { ChannelType, TYPE, DEFAULT_SENDER_NAME, EVENT_ZALO, ERROR_CODE_ZALO } from './constants/index.constants'
import { ProducerService } from 'src/kafka/producer.service'
import { TOPIC } from './constants/topic.constants'
import { TenantService } from 'src/tenant/tenant.service'
import axios from 'axios'
@Injectable()
export class WebhookService {
  private readonly _logger
  constructor(
    loggerService: LoggerService,
    private readonly producerService: ProducerService,
    private readonly tenantService: TenantService
  ) {
    this._logger = loggerService.getLogger(WebhookService)
  }

  async listenEventFromZalo(body: any) {
    this._logger.info(`Data receive from Zalo is: ${JSON.stringify(body)}`)
    const { event_name } = body
    if (event_name == EVENT_ZALO.FOLLOW || event_name == EVENT_ZALO.UN_FOLLOW) return HttpStatus.OK
    const senderName = await this.getSenderName(body)
    const dataConvert = this.convertDataZalo(body, senderName)
    this._logger.info(`Data after convert and send to kafka is: ${JSON.stringify(dataConvert)}`)
    //send data to kafka
    await this.producerService.produce(TOPIC.ACD_MESSAGE_RECEIVED, { value: JSON.stringify(dataConvert) })
    return HttpStatus.OK
  }

  async getSenderName(body) {
    const { app_id, sender } = body
    const tokenOfApp = await this.tenantService.findTokenByAppId(app_id)
    if (!tokenOfApp) return DEFAULT_SENDER_NAME.NOT_TOKEN

    const headersSend = {
      'access_token': tokenOfApp
    }
    const response = await axios.get(`https://openapi.zalo.me/v2.0/oa/getprofile?data={"user_id":"${sender.id}"}`, { headers: headersSend })

    const { data } = response

    if (data.error == ERROR_CODE_ZALO.NOT_FOLLOW) return DEFAULT_SENDER_NAME.NOT_FOLLOW

    return data.data.display_name
  }

  private convertDataZalo(data, senderName) {
    const { event_name, app_id, sender, message, timestamp } = data
    const newData: IFormatData = {
      messageId: message?.msg_id ?? 'not found',
      text: message?.text,
      timestamp: Number(timestamp),
      senderId: sender?.id,
      senderName: senderName,
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

