/**
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/sync-user.ts
 * OR: npx tsx scripts/sync-user.ts
 *
 * Fill in the values below from your Clerk Dashboard (Users section).
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const USER_TO_SYNC = {
  externalUserId: "user_REPLACE_WITH_CLERK_USER_ID", // e.g. user_2abc123...
  username: "REPLACE_WITH_USERNAME",
  imageUrl: "REPLACE_WITH_IMAGE_URL", // from Clerk dashboard
};

async function main() {
  const existing = await db.user.findUnique({
    where: { externalUserId: USER_TO_SYNC.externalUserId },
  });

  if (existing) {
    console.log("✅ User already exists in DB:", existing);
    return;
  }

  const user = await db.user.create({
    data: {
      externalUserId: USER_TO_SYNC.externalUserId,
      username: USER_TO_SYNC.username,
      imageUrl: USER_TO_SYNC.imageUrl,
      stream: {
        create: {
          name: `${USER_TO_SYNC.username}'s stream`,
        },
      },
    },
  });

  console.log("✅ User synced to database:", user);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
