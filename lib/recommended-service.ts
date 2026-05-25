import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { getExcludedUserIdsForRecommendations } from "@/lib/user-query-helpers";

export const getRecommended = async () => {
  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let users = [];

  if (userId) {
    const excludedIds = await getExcludedUserIdsForRecommendations(userId);

    users = await db.user.findMany({
      where: {
        id: { notIn: excludedIds },
      },
      include: {
        stream: {
          select: {
            isLive: true,
          },
        },
      },
      orderBy: [
        {
          stream: {
            isLive: "desc",
          }
        },
        {
          createdAt: "desc"
        },
      ]
    })
  } else {
    users = await db.user.findMany({
      include: {
        stream: {
          select: {
            isLive: true,
          },
        },
      },
      orderBy: [
        {
          stream: {
            isLive: "desc",
          }
        },
        {
          createdAt: "desc"
        },
      ]
    });
  }

  return users;
};
