import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { LoggerService } from '../libs/log.service'
import { IFormatData } from './interface/format-data.interface'
import { ChannelType, TYPE, DEFAULT_SENDER_NAME, EVENT_ZALO, ERROR_CODE_ZALO, MessageType } from './constants/index.constants'
import { ProducerService } from '../kafka/producer.service'
import { TOPIC } from './constants/topic.constants'
import axios from 'axios'
import { SendMessageToZaloRequest, SendMessageToZaloResponse } from '../protos/zalo-connector.pb'
import { ConversationService } from '../conversation/conversation.service'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import * as crypto from 'crypto'
const FormData = require('form-data')
import { UPLOAD_FAIL } from './constants/error.constants'
import { RpcException } from '@nestjs/microservices'
import { IDataResponse } from './interface/data-response.interface'
import { redisClient } from 'src/redis/redis.module'
import { RedisClientType } from '@redis/client'
import { REDIS_CACHE_TOKEN } from 'src/conversation/constants/index.constants'
import * as moment from 'moment'
@Injectable()
export class WebhookService {
  private readonly _logger
  constructor(
    loggerService: LoggerService,
    private readonly producerService: ProducerService,
    private readonly conversationService: ConversationService,
    @Inject(redisClient)
    private readonly clientRedis: RedisClientType
  ) {
    this._logger = loggerService.getLogger(WebhookService)
  }

  async listenEventFromZalo(body: any) {
    this._logger.info(`Data receive from Zalo is: ${JSON.stringify(body, null, '\t')}`)
    const { event_name } = body
    if (event_name == EVENT_ZALO.FOLLOW || event_name == EVENT_ZALO.UN_FOLLOW) return HttpStatus.OK
    const senderName = await this.getSenderName(body)
    const dataConvert = this.convertDataZalo(body, senderName)
    this._logger.info(`Data after convert and send to kafka is: ${JSON.stringify(dataConvert)}`)
    //send data to kafka
    await this.producerService.produce(TOPIC.ACD_MESSAGE_RECEIVED, { value: JSON.stringify(dataConvert) })
    return HttpStatus.OK
  }

  async sendMessageToZalo(request: SendMessageToZaloRequest): Promise<SendMessageToZaloResponse> {
    try {
      this._logger.debug(`Data send to Zalo reply customer message: ${JSON.stringify(request.message, null, '\t')}`)
      const { conversationId, messageType, text, cloudAgentId, cloudTenantId } = request.message
      const infoApp = await this.conversationService.findInfoAppToReply(conversationId)
      //const tokenOfApp = await this.tenantService.findTokenByAppId(infoApp.applicationId)
      const listApp = JSON.parse(await this.clientRedis.get(REDIS_CACHE_TOKEN))
      const { accessToken } = listApp.find(el => el.applicationId === infoApp.applicationId)
      let fileName: string = ''
      switch (messageType) {
        case MessageType.IMAGE:
          const ImageUpload = this.saveFile(request.attachments)
          this._logger.info(`ImageUpload is: ${ImageUpload}`)
          fileName = ImageUpload
          const readImage = readFileSync(`./public/socials/${ImageUpload}`)
          const responseUploadImage = await this.requestToZaloUploadImage(accessToken, readImage, ImageUpload)
          if (responseUploadImage.data.message != "Success") throw new RpcException(UPLOAD_FAIL + responseUploadImage.data.message)
          await this.requestToZaloSendMessage(accessToken, infoApp, messageType, text, responseUploadImage?.data?.data?.attachment_id)
          break
        case MessageType.FILE:
          const fileUpload = this.saveFile(request.attachments)
          this._logger.info(`FileUpload is: ${fileUpload}`)
          fileName = fileUpload
          const readFile = readFileSync(`./public/socials/${fileUpload}`)
          const responseUploadFile = await this.requestToZaloUploadFile(accessToken, readFile, fileUpload)
          if (responseUploadFile.data.message != "Success") throw new RpcException(UPLOAD_FAIL + responseUploadFile.data.message)
          await this.requestToZaloSendMessage(accessToken, infoApp, messageType, text, undefined, responseUploadFile?.data?.data?.token)
          break

        case MessageType.TEXT:
          await this.requestToZaloSendMessage(accessToken, infoApp, messageType, text)
          break

        default:
          break
      }

      const dataResponse: IDataResponse = {
        cloudAgentId: cloudAgentId,
        cloudTenantId: cloudTenantId,
        conversationId: conversationId,
        messageType: messageType,
        text: text,
        attachment: {
          fileName: fileName
        }
      }

      return dataResponse

    } catch (error) {
      this._logger.error(`Error send message to Zalo is: ${error}`)
      throw new RpcException(error)
    }
  }

  async requestToZaloUploadFile(tokenOfApp, readFile, fileUpload) {
    const headersSend = {
      access_token: tokenOfApp
    }
    const data = new FormData()
    data.append('file', readFile, fileUpload)
    return axios.post(`https://openapi.zalo.me/v2.0/oa/upload/file`, data, { headers: headersSend })
  }

  async requestToZaloUploadImage(tokenOfApp, readFile, fileUpload) {
    const headersSend = {
      access_token: tokenOfApp
    }
    const data = new FormData()
    data.append('file', readFile, fileUpload)
    return axios.post(`https://openapi.zalo.me/v2.0/oa/upload/image`, data, { headers: headersSend })
  }


  async requestToZaloSendMessage(tokenOfApp, infoApp, messageType, text, attachment_id?, tokenFile?) {
    const headersSend = {
      access_token: tokenOfApp
    }
    const data = {
      recipient: {
        user_id: infoApp.senderId
      }
    }

    switch (messageType) {
      case MessageType.TEXT:
        data['message'] = {}
        data['message']['text'] = text
        break
      case MessageType.IMAGE:
        data['message'] = {}
        data['message']['attachment'] = {
          type: "template",
          payload: {
            template_type: "media",
            elements: [{
              media_type: "image",
              attachment_id: attachment_id
            }]
          }
        }
        break
      case MessageType.FILE:
        data['message'] = {}
        data['message']['attachment'] = {
          type: "file",
          payload: {
            token: tokenFile
          }
        }
        break
      default:
        break
    }

    const resp = await axios.post(`https://openapi.zalo.me/v3.0/oa/message/cs`, data, { headers: headersSend })
    if (resp.data.error == 0) return resp
    throw new BadRequestException(resp.data.message)
  }

  private saveFile(file) {
    const formatFileName = `/${moment(new Date()).format("YYYY")}/${moment(new Date()).format("MM")}/${moment(new Date()).format("DD")}`
    const dir = `./public/socials/${formatFileName}`
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    if (!file) return undefined

    const { originalname } = file
    const type = originalname.split('.').pop()

    const fileName = `${originalname}${Date.now()}`
    const fileNameEncode = crypto.createHash('md5').update(fileName).digest("hex")
    writeFileSync(`${dir}/${fileNameEncode}.${type}`, file.buffer)
    return `${formatFileName}/${fileNameEncode}.${type}`
  }

  async getSenderName(body) {
    const { app_id, sender } = body
    const listApp = JSON.parse(await this.clientRedis.get(REDIS_CACHE_TOKEN))
    const { accessToken } = listApp.find(el => el.applicationId === app_id)


    if (!accessToken) return DEFAULT_SENDER_NAME.NOT_TOKEN

    const headersSend = {
      access_token: accessToken
    }
    const response = await axios.get(`https://openapi.zalo.me/v2.0/oa/getprofile?data={"user_id":"${sender.id}"}`, { headers: headersSend })

    const { data } = response

    if (data.error == ERROR_CODE_ZALO.NOT_FOLLOW) return DEFAULT_SENDER_NAME.NOT_FOLLOW

    return data?.data?.display_name || "Not find display_name"
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

