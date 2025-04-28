import { Inject, forwardRef, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => PrismaService)) private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    public async generateToken(user: User): Promise<string> {
        const payload = { sub: user.id, login: user.username };
        return this.jwtService.sign(payload);
    }

    public async validateUser(login: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username: login }
        });
        if (!user) {
            return null;
        }
        const isValidPass = await argon2.verify(user.password, password);
        if (!isValidPass) {
            return null
        }
        const { password: _, ...result } = user;
        return result;
    }
}