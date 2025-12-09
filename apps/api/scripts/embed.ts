import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from apps/api/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function main() {
  console.log('🔄 Starting embedding generation (Gemini)...');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing in environment variables');
    process.exit(1);
  }

  const entries = await prisma.yellowBookEntry.findMany({
    where: {
      OR: [
        { embedding: { equals: [] } },
        { embeddedAt: null },
      ],
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  console.log(`Found ${entries.length} entries to embed.`);

  for (const entry of entries) {
    try {
      const textToEmbed = `
        Name: ${entry.name}
        Summary: ${entry.summary}
        Description: ${entry.description || ''}
        Address: ${entry.streetAddress}, ${entry.district}, ${entry.province}
        Tags: ${entry.tags.map((t) => t.tag?.label).join(', ')}
      `.trim();

      const embedding = await generateEmbedding(textToEmbed);

      await prisma.yellowBookEntry.update({
        where: { id: entry.id },
        data: {
          embedding: embedding,
          embeddedAt: new Date(),
        },
      });

      console.log(`✅ Embedded: ${entry.name}`);
    } catch (error) {
      console.error(`❌ Failed to embed ${entry.name}:`, error);
    }
  }

  console.log('✨ Embedding generation complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
