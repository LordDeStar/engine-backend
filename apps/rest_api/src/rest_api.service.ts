import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/user/create-user.dto';
@Injectable()
export class RestApiService implements OnModuleInit {
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('create-user');
    this.kafkaClient.subscribeToResponseOf('auth');
  }
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafkaProxy) { }

  public async createUser(dto: CreateUserDto): Promise<any> {
    return await this.kafkaClient.send('create-user', dto).toPromise();
  }

  public async login(dto: CreateUserDto): Promise<any> {
    return await this.kafkaClient.send('auth', dto).toPromise();
  }

}
