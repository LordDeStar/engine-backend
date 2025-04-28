import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) { }


  @MessagePattern('auth')
  public async auth(@Payload() credentials: { username: string, password: string }): Promise<any> {
    const user = await this.authService.validateUser(credentials.username, credentials.password);
    if (!user) {
      return { error: "Пользователь не найден!" };
    }

    const token = await this.authService.generateToken(user);
    return { access_token: token };
  }

  @MessagePattern('create-user')
  public async createUser(@Payload() data: { username: string, password: string }): Promise<any> {
    return await this.usersService.createUser(data.username, data.password);
  }
}
