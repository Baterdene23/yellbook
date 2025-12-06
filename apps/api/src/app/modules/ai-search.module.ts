import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AISearchController } from './ai-search.controller';
import { AISearchService } from '../services/ai-search.service';
import { RedisService } from '../services/redis.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AISearchController],
  providers: [AISearchService, RedisService, PrismaService],
  exports: [AISearchService, RedisService],
})
export class AISearchModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    await this.redisService.connect();
    console.log('✅ AISearchModule initialized');
  }

  async onModuleDestroy() {
    await this.redisService.disconnect();
    console.log('✅ AISearchModule destroyed');
  }
}
