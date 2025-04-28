import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  public async createUser(username: string, password: string): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { username }
    });
    if (existingUser) {
      return { error: "Пользователь с таким именем уже существует!" };
    }
    const hash = await argon2.hash(password);
    await this.prisma.user.create({
      data: {
        username,
        password: hash
      }
    });
    return { message: "success" };
  }
}
