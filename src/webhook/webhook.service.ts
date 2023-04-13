import { Injectable } from '@nestjs/common'
import { LoggerService } from '../libs/log.service'
import { IFormatData } from './interface/format-data.interface'
import { ChannelType } from './constants/index.constants'
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
  }

  private convertDataZalo(data) {
    const { event_name, app_id, sender, message, timestamp } = data
    const newData: IFormatData = {
      messageId: message.msg_id ?? 'not found',
      text: message.text,
      timestamp: timestamp,
      senderId: sender.id,
      applicationId: app_id,
      channel: ChannelType.ZALO,
      event: event_name,
      media: message.attachments
    }
    return newData
  }
}

