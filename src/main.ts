import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as fs from 'fs'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as http from 'http'
import * as https from 'https'
import * as express from 'express'
import { join } from 'path'

async function bootstrap() {
  const privateKey = fs.readFileSync(join(process.cwd(), './src/cert/privateKeyFBAuthenticate.key'), 'utf8')
  const certificate = fs.readFileSync(join(process.cwd(), './src/cert/certificateFBAuthenticate.crt'), 'utf8')
  const httpsOptions = { key: privateKey, cert: certificate }

  const server = express()
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  )
  await app.init()

  http.createServer(server).listen(6969)
  //https.createServer(httpsOptions, server).listen(6969)
}

bootstrap();

