import { Logger } from '@nestjs/common'
import { Kafka, Message, Producer } from 'kafkajs'
import { sleep } from '../libs/sleep'
import { IProducer } from './producer.interface'
import { logLevel } from 'kafkajs'

export class KafkajsProducer implements IProducer {
    private readonly kafka: Kafka
    private readonly producer: Producer
    private readonly logger: Logger

    constructor(
        private readonly topic: string, 
        broker: string,
        clientId: string,
        connectionTimeout: string,
        authenticationTimeout: string,
        username: string,
        password: string,
    ) {
        this.kafka = new Kafka({
            brokers: [broker],
            clientId: clientId,
            sasl: {
                mechanism: 'plain',
                username: username,
                password: password
            },
            logLevel: logLevel.ERROR,
            connectionTimeout: Number(connectionTimeout),
            authenticationTimeout: Number(authenticationTimeout)
        })
        this.producer = this.kafka.producer()
        this.logger = new Logger(topic)
    }

    async produce(message: Message) {
        await this.producer.send({ topic: this.topic, messages: [message] }) 
    }

    async connect() {
        try {
            await this.producer.connect()
        } catch (err) {
            this.logger.error('Failed to connect to Kafka.', err)
            await sleep(5000)
            await this.connect()
        }
    }

    async disconnect() {
        await this.producer.disconnect()
    }
}