import { db } from "@/lib/db";

/** True when `prisma generate` has been run for Follow/Block models. */
export const hasFollowAndBlockModels = () =>
  "follow" in db &&
  "block" in db &&
  typeof (db as { follow?: { findMany?: unknown } }).follow?.findMany ===
    "function";

/** User ids to exclude from recommendations (self, already followed, blockers). */
export const getExcludedUserIdsForRecommendations = async (userId: string) => {
  if (!hasFollowAndBlockModels()) {
    return [userId];
  }

  const [follows, blocks] = await Promise.all([
    db.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    }),
    db.block.findMany({
      where: { blockedId: userId },
      select: { blockerId: true },
    }),
  ]);

  return [
    userId,
    ...follows.map((f) => f.followingId),
    ...blocks.map((b) => b.blockerId),
  ];
};

/** User ids who have blocked the current user (exclude from feeds/search). */
export const getBlockerUserIds = async (userId: string) => {
  if (!hasFollowAndBlockModels()) {
    return [];
  }

  const blocks = await db.block.findMany({
    where: { blockedId: userId },
    select: { blockerId: true },
  });

  return blocks.map((b) => b.blockerId);
};
