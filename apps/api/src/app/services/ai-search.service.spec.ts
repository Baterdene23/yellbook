import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AISearchService } from '../services/ai-search.service';
import { RedisService } from '../services/redis.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AISearchService', () => {
  let service: AISearchService;
  let redisService: RedisService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    redisService = new RedisService();
    prismaService = new PrismaService();
    service = new AISearchService(prismaService, redisService);
    await redisService.connect();
  });

  afterEach(async () => {
    await redisService.disconnect();
  });

  describe('search', () => {
    it('should return search results', async () => {
      const results = await service.search({
        query: 'ресторан',
        limit: 5,
        useCache: false,
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(5);

      if (results.length > 0) {
        expect(results[0]).toHaveProperty('id');
        expect(results[0]).toHaveProperty('name');
        expect(results[0]).toHaveProperty('summary');
        expect(results[0]).toHaveProperty('similarity');
        expect(results[0].similarity).toBeGreaterThanOrEqual(0);
        expect(results[0].similarity).toBeLessThanOrEqual(1);
      }
    });

    it('should cache results', async () => {
      const query = 'test-query-' + Date.now();

      // First call - should miss cache
      const results1 = await service.search({
        query,
        limit: 5,
        useCache: true,
      });

      // Second call - should hit cache
      const results2 = await service.search({
        query,
        limit: 5,
        useCache: true,
      });

      expect(results1).toEqual(results2);
    });

    it('should invalidate cache', async () => {
      const query = 'test-query-invalidate';

      await service.search({
        query,
        limit: 5,
        useCache: true,
      });

      // Cache байгаа болно
      const cachedValue = await redisService.get(`ai-search:${query}`);
      expect(cachedValue).not.toBeNull();

      // Cache сайтар
      await service.invalidateCache(query);

      // Cache хоосон болно
      const cachedValueAfter = await redisService.get(
        `ai-search:${query}`
      );
      expect(cachedValueAfter).toBeNull();
    });

    it('should sort by similarity', async () => {
      const results = await service.search({
        query: 'ресторан',
        limit: 10,
        useCache: false,
      });

      // Similarity өөрөөр буурах байдалтай байх ёстой
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].similarity).toBeGreaterThanOrEqual(
          results[i].similarity
        );
      }
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity correctly', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];

      // Same vectors = similarity 1
      expect(service['cosineSimilarity'](a, b)).toBe(1);

      // Different vectors
      const c = [1, 1, 0];
      const similarity = service['cosineSimilarity'](a, c);
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThan(1);
    });

    it('should handle zero vectors', () => {
      const a = [0, 0, 0];
      const b = [1, 0, 0];

      expect(service['cosineSimilarity'](a, b)).toBe(0);
    });
  });

  describe('cache operations', () => {
    it('should clear all cache', async () => {
      // Хэд хэдэн query-ийг cache-д хадгал
      await service.search({
        query: 'query1',
        limit: 5,
        useCache: true,
      });
      await service.search({
        query: 'query2',
        limit: 5,
        useCache: true,
      });

      // Cache байгаа болно
      let keys = await redisService.keys('ai-search:*');
      expect(keys.length).toBeGreaterThan(0);

      // Clear all
      await service.clearAllCache();

      // Cache хоосон болно
      keys = await redisService.keys('ai-search:*');
      expect(keys.length).toBe(0);
    });
  });
});
