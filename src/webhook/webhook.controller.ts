import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { SendMessageToZaloRequest, SendMessageToZaloResponse, ZALO_CONNECTOR_SERVICE_NAME } from '../protos/zalo-connector.pb'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post('/zalo')
  @HttpCode(HttpStatus.OK)
  listenEventFromZalo(@Body() body: any) {
    return this.webhookService.listenEventFromZalo(body)
  }

  @Get('/zalo')
  @HttpCode(HttpStatus.OK)
  verifyUrlCallback(@Query() query: any) {
    return HttpStatus.OK
  }

  @GrpcMethod(ZALO_CONNECTOR_SERVICE_NAME)
  async sendMessageToZalo(request: SendMessageToZaloRequest): Promise<SendMessageToZaloResponse>{
    return this.webhookService.sendMessageToZalo(request)
  }
}
