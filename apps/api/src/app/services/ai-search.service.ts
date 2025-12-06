import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';

export interface SearchResult {
  id: string;
  name: string;
  summary: string;
  distance: number;
  similarity: number;
}

export interface AISearchRequest {
  query: string;
  limit?: number;
  useCache?: boolean;
}

@Injectable()
export class AISearchService {
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  private readonly EMBEDDING_MODEL = 'text-embedding-3-small';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  async search(req: AISearchRequest): Promise<SearchResult[]> {
    const { query, limit = 5, useCache = true } = req;

    // Cache шалгана
    if (useCache) {
      const cached = await this.redis.get(`ai-search:${query}`);
      if (cached) {
        console.log(`📦 Cache hit: ${query}`);
        return JSON.parse(cached);
      }
    }

    // Query-ийн embedding авна
    const queryEmbedding = await this.getEmbedding(query);

    // Businesses-ээс ойрх embedding-ууд хайна
    const businesses = await this.prisma.yellowBookEntry.findMany({
      where: {
        embeddedAt: { not: null },
      },
      select: {
        id: true,
        name: true,
        summary: true,
        embedding: true,
      },
    });

    // Cosine similarity хэсэх
    const results = businesses
      .map((business) => ({
        id: business.id,
        name: business.name,
        summary: business.summary,
        similarity: this.cosineSimilarity(queryEmbedding, business.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map((item, index) => ({
        ...item,
        distance: index, // Ranking position
      }));

    // Cache-д хадгална
    if (useCache) {
      await this.redis.set(
        `ai-search:${query}`,
        JSON.stringify(results),
        this.CACHE_TTL
      );
      console.log(`💾 Cached: ${query}`);
    }

    return results;
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: this.EMBEDDING_MODEL,
          input: text,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Embedding error:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async invalidateCache(query: string): Promise<void> {
    await this.redis.delete(`ai-search:${query}`);
  }

  async clearAllCache(): Promise<void> {
    const pattern = 'ai-search:*';
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.delete(...keys);
    }
  }
}
