import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post('/zalo')
  @HttpCode(HttpStatus.OK)
  listenEventFromZalo(@Body() body: any) {
    return this.webhookService.listenEventFromZalo(body)
  }

}
