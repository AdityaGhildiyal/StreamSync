/**
 * Deletes all Stream documents in MongoDB that have no associated User.
 * Run with: npx tsx scripts/cleanup-orphaned-streams.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Get all streams and include their user relation
  const allStreams = await db.stream.findMany({
    select: { id: true, userId: true, name: true },
  });

  // Get all valid user IDs
  const allUsers = await db.user.findMany({ select: { id: true } });
  const validUserIds = new Set(allUsers.map((u) => u.id));

  // Find orphaned streams
  const orphaned = allStreams.filter((s) => !validUserIds.has(s.userId));

  if (orphaned.length === 0) {
    console.log("✅ No orphaned streams found. DB is clean.");
    return;
  }

  console.log(`⚠️  Found ${orphaned.length} orphaned stream(s):`);
  orphaned.forEach((s) => console.log(`  - Stream "${s.name}" (id: ${s.id}, userId: ${s.userId})`));

  // Delete them
  const deleted = await db.stream.deleteMany({
    where: { id: { in: orphaned.map((s) => s.id) } },
  });

  console.log(`🗑️  Deleted ${deleted.count} orphaned stream(s).`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
