import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding admin user...");

  try {
    const adminEmail = "admin@yellbook.com";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = await (prisma as any).user.upsert({
      where: { email: adminEmail },
      update: {
        role: "ADMIN",
      },
      create: {
        email: adminEmail,
        name: "Admin",
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user seeded:", admin.email, "with role:", admin.role);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
