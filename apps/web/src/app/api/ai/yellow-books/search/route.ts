import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from 'redis';

// Initialize Prisma Client
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Redis Client
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
})();

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, limit = 5, useCache = true } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check Cache
    const cacheKey = `ai:search:${query.trim().toLowerCase()}`;
    if (useCache) {
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        console.log('🎯 Cache Hit');
        return NextResponse.json(JSON.parse(cachedResult));
      }
    }

    // 1. Generate embedding for the query
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResponse = await model.embedContent(query);
    const queryEmbedding = embeddingResponse.embedding.values;

    // 2. Fetch all entries with embeddings
    const entries = await prisma.yellowBookEntry.findMany({
      where: {
        NOT: {
          embedding: { equals: [] },
        },
      },
      select: {
        id: true,
        name: true,
        summary: true,
        embedding: true,
      },
    });

    // 3. Calculate similarity and sort
    const results = entries
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        summary: entry.summary,
        similarity: cosineSimilarity(queryEmbedding, entry.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    // Cache the result (expire in 1 hour)
    await redis.set(cacheKey, JSON.stringify(results), { EX: 3600 });

    return NextResponse.json(results);
  } catch (error) {
    console.error('AI Search Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
