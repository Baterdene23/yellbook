import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// OpenAI API ашиглана - embedding хэрэгтэй
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = 'text-embedding-3-small';

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: EMBEDDING_MODEL,
        input: text,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
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

async function embedAllBusinesses() {
  console.log('🚀 Businesses embedding эхлүүлээ...\n');

  const businesses = await prisma.yellowBookEntry.findMany({
    where: {
      embedding: {
        equals: [],
      },
    },
  });

  console.log(`📊 Embedding хэрэгтэй: ${businesses.length} businesses\n`);

  let completed = 0;
  let failed = 0;

  for (const business of businesses) {
    try {
      // Embedding текст үүсгэнэ
      const text = [
        business.name,
        business.shortName,
        business.summary,
        business.description,
        business.category,
        business.district,
        business.province,
      ]
        .filter(Boolean)
        .join(' ');

      console.log(`⏳ Processing: ${business.name}...`);

      const embedding = await getEmbedding(text);

      // Database-д хадгалнa
      await prisma.yellowBookEntry.update({
        where: { id: business.id },
        data: {
          embedding,
          embeddedAt: new Date(),
        },
      });

      completed++;
      console.log(`✅ [${completed}/${businesses.length}] ${business.name}\n`);

      // Rate limit: OpenAI-й 3 requests per minute
      await new Promise((resolve) => setTimeout(resolve, 20000));
    } catch (error) {
      failed++;
      console.error(`❌ Failed: ${business.name}`);
      console.error(error);
    }
  }

  console.log(`\n📈 Embedding дууссан:`);
  console.log(`   ✅ Completed: ${completed}`);
  console.log(`   ❌ Failed: ${failed}`);

  await prisma.$disconnect();
}

// Alternative:Local embedding model (Ollama)
async function getEmbeddingLocal(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      'http://localhost:11434/api/embeddings',
      {
        model: 'nomic-embed-text',
        prompt: text,
      }
    );

    return response.data.embedding;
  } catch (error) {
    console.error('Local embedding error:', error);
    throw error;
  }
}

// Run embedding
embedAllBusinesses().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
