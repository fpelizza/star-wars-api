import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    let retries = 5;

    while (retries) {
      try {
        await this.$connect();
        break;
      } catch (error) {
        retries--;
        console.log('Retrying database connection...');
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
  }
}
