import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Logger,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AISearchService, AISearchRequest, SearchResult } from '../services/ai-search.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('api/ai/yellow-books')
export class AISearchController {
  private readonly logger = new Logger(AISearchController.name);

  constructor(private readonly aiSearchService: AISearchService) {}

  @Post('/search')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  async search(@Body() request: AISearchRequest): Promise<SearchResult[]> {
    this.logger.log(`🔍 Search query: "${request.query}"`);

    if (!request.query || request.query.trim().length === 0) {
      throw new BadRequestException('Query is required');
    }

    if (request.query.length > 500) {
      throw new BadRequestException('Query too long (max 500 characters)');
    }

    try {
      const results = await this.aiSearchService.search({
        query: request.query.trim(),
        limit: request.limit || 5,
        useCache: request.useCache !== false,
      });

      this.logger.log(`✅ Found ${results.length} results`);
      return results;
    } catch (error) {
      this.logger.error('Search error:', error);
      throw new BadRequestException('Search failed: ' + error.message);
    }
  }

  @Delete('/cache')
  async clearCache(@Query('query') query?: string): Promise<{ message: string }> {
    if (query) {
      await this.aiSearchService.invalidateCache(query);
      return { message: `Cache cleared for query: ${query}` };
    } else {
      await this.aiSearchService.clearAllCache();
      return { message: 'All cache cleared' };
    }
  }
}
