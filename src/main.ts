import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggerService } from './libs/log.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const logger = app.get<LoggerService>(LoggerService)

  const config = new DocumentBuilder()
    .setTitle('Zalo Connector')
    .setDescription('Zalo Messenging Connector')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(6969)

  logger.getLogger(AppModule).info(`Application running on http://0.0.0.0:6969`)
}
bootstrap()
