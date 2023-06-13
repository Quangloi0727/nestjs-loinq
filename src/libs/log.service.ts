import { getLogger, configure } from 'log4js'
import * as log4js_extend from 'log4js-extend'
import * as fs from 'fs-extra'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LoggerService {

    getLogger(moduleName): any {
        if (!(moduleName instanceof String)) moduleName = moduleName.name || 'Default'
        try {
            const appList = []
            appList.push(moduleName)
            const logger = getLogger(moduleName)
            const appLog = './logs/app.log'
            fs.ensureFileSync(appLog)

            const log4js = configure({
                appenders: {
                    console: {
                        type: 'console',
                        layout: {
                            type: 'pattern',
                            pattern: '%[%d{yyyy-MM-dd hh:mm:ss} [%p]%] [%c]%]: %m'
                        }
                    },
                    filelog: {
                        type: 'file', filename: appLog, pattern: '-yyyy-MM-dd', category: appList,
                        layout: {
                            type: 'pattern',
                            pattern: '%[%d{yyyy-MM-dd hh:mm:ss} [%p]%] [%c]%]: %m'
                        }
                    } //log theo từng ngày (có thể set up theo từng giờ/phút/giây -yyyy-MM-dd-hh-mm-ss)
                },
                categories: {
                    file: { appenders: ['filelog'], level: 'error' },
                    another: { appenders: ['console'], level: 'trace' },
                    default: { appenders: ['console', 'filelog'], level: 'trace' }
                }
            })

            log4js_extend(log4js, {
                format: "[@name (@file:@line:@column)]"
            })

            return logger
        } catch (err) {
            console.log(err)
        }
        return
    }
}