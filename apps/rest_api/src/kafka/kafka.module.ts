import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "KAFKA_SERVICE",
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['kafka:9092'],
                        clientId: "rest-api"
                    },
                    consumer: {
                        groupId: 'rest-api-group',
                        allowAutoTopicCreation: true
                    },
                    producer: {
                        allowAutoTopicCreation: true
                    },
                }
            }
        ])
    ],
    exports: [ClientsModule]
})
export class KafkaModule { }