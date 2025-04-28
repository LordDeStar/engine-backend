import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: "qwe2312z123!32",
            signOptions: { expiresIn: '60m' }
        })
    ],
    providers: [AuthService, PrismaService],
    exports: [PassportModule, AuthService, JwtModule]
})
export class AuthModule { }