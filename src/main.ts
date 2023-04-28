import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggerService } from './libs/log.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { protobufPackage } from './protos/zalo-connector.pb'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService)
  const grpcUrl = configService.get('GRPC_URL_CONNECTION')

  const logger = app.get<LoggerService>(LoggerService)

  const config = new DocumentBuilder()
    .setTitle('Zalo Connector')
    .setDescription('Zalo Messenging Connector')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  //connect grpc
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: grpcUrl || 'localhost:6868',
      package: protobufPackage,
      protoPath: join('node_modules/acd-proto/proto/zalo-connector.proto'),
    },
  })
  await app.startAllMicroservices()
  logger.getLogger(AppModule).info(`Application running on http://0.0.0.0:6969`)

  // set static file
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  })
  logger.getLogger(AppModule).info(`Path static file is: ${join(__dirname, '..', 'public') }`)

  await app.listen(6969)
  logger.getLogger(AppModule).info(`Application running on http://0.0.0.0:6969`)
}
bootstrap()
