import { prisma } from "@yellbook/config";

async function seed() {
  console.log("🌱 Seeding admin user...");

  try {
    const adminEmail = "admin@yellbook.com";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists:", adminEmail);
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        role: "ADMIN",
        image: null,
        emailVerified: new Date(),
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => console.log("✅ Seed completed successfully"))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
