import { ClientKafkaProxy } from '@nestjs/microservices';
import { Injectable, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafkaProxy) { }
    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('create-user');
        this.kafkaClient.subscribeToResponseOf('auth');
    }


    public async createUser(dto: CreateUserDto): Promise<any> {
        return await this.kafkaClient.send('create-user', dto).toPromise();
    }

    public async login(dto: CreateUserDto): Promise<any> {
        return await this.kafkaClient.send('auth', dto).toPromise();
    }

}