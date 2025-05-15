import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super()
    }
    public async onModuleInit() {
        await this.$connect(); // Подключение к базе данных
    }

    public async onModuleDestroy() {
        await this.$disconnect(); // Отключение от базы данных
    }
}