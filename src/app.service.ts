import { Injectable } from '@nestjs/common'
import { LoggerService } from './libs/log.service'

@Injectable()
export class AppService {

  constructor(private readonly _loggerService: LoggerService) {
  }

  get logger(): LoggerService {
    return this._loggerService
  }

  getHello(): string {
    return 'Hello World!'
  }
}
