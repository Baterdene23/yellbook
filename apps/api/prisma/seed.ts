// Эхлээд Prisma client-ийг зөв import хийх
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed data оруулж эхлэлээ...');

  try {
    // Хүснэгтийг цэвэрлэх
    await prisma.business.deleteMany();
    await prisma.category.deleteMany();
    console.log('✅ Хуучин өгөгдлийг цэвэрлэлээ');

    const entries = [
      {
        businessName: "Tech Solutions Inc.",
        category: "Technology",
        phoneNumber: "+976-7010-0101",
        email: "contact@techsolutions.mn",
        address: "Сүхбаатар дүүрэг, 1-р хороо, Улаанбаатар",
        website: "https://techsolutions.mn",
        description: "Веб хөгжүүлэлтийн мэргэжлийн компани"
      },
      {
        businessName: "Green Leaf Restaurant",
        category: "Food & Dining",
        phoneNumber: "+976-7010-0102", 
        email: "info@greenleaf.mn",
        address: "Хан-Уул дүүрэг, 5-р хороо, Улаанбаатар",
        website: "https://greenleaf.mn",
        description: "Байгальд ээлтэй органик ресторан"
      },
      {
        businessName: "Fit Life Gym",
        category: "Health & Fitness",
        phoneNumber: "+976-7010-0103",
        email: "membership@fitlife.mn",
        address: "Баянгол дүүрэг, 8-р хороо, Улаанбаатар",
        website: "https://fitlifegym.mn",
        description: "Орчин үеийн дасгал хийх төв"
      },
      {
        businessName: "Номын дэлгүүр",
        category: "Retail",
        phoneNumber: "+976-7010-0104",
        address: "Сонгинохайрхан дүүрэг, 2-р хороо, Улаанбаатар",
        description: "Ховор номын цуглуулгатай номын дэлгүүр"
      },
      {
        businessName: "Бүтээлч Дизайн Агентлаг",
        category: "Marketing", 
        phoneNumber: "+976-7010-0105",
        email: "hello@creativeagency.mn",
        address: "Чингэлтэй дүүрэг, 4-р хороо, Улаанбаатар",
        website: "https://creativeagency.mn",
        description: "Орчин үеийн брэндүүдэд зориулсан дизайн, маркетингийн агентлаг"
      }
    ];

 for (const entry of entries) {
  await prisma.business.create({
    data: {
      name: entry.businessName,
      description: entry.description,
      address: entry.address,
      phone: entry.phoneNumber,
      email: entry.email,
      website: entry.website,
      category: {
        connectOrCreate: {
          where: { name: entry.category },
          create: { name: entry.category }
        }
      }
    }
  });
  console.log(`✅ Үүсгэв: ${entry.businessName}`);
}

    console.log('🎉 Seed data амжилттай орууллаа!');
  } catch (error) {
    console.error('❌ Seed алдаа:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed процесс алдаатай дууслаа:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });