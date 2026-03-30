import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
        console.log(`Seed skipped: admin '${username}' already exists.`);
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({
        data: {
            username,
            passwordHash,
            createdByUsername: "seed",
        },
    });

    console.log(`Seed created admin '${username}'. Change this password after first login.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
