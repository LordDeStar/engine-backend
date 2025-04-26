import { Controller, Get } from '@nestjs/common';
import { RestApiService } from './rest_api.service';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
@Controller()
export class RestApiController {

  @Client({
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 3001
    },
  })
  private client: ClientProxy;

  @Get('hi')
  async sayHi(): Promise<string> {
    const response = await this.client.send({ cmd: 'say-hi' }, {}).toPromise();
    return response;
  }


}
