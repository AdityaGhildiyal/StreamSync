import { db } from "@/lib/db"
import { getSelf } from "@/lib/auth-service"

export const getStreams = async () => {
  let streams = [];

  streams = await db.stream.findMany({
    select: {
      id: true,
      user: true,
      isLive: true,
      name: true,
      thumbnailUrl: true,
    },
    orderBy: [
      {
        isLive: "desc",
      },
      {
        updatedAt: "desc",
      }
    ]
  });

  // Filter out orphaned streams whose user was deleted
  return streams.filter((stream) => stream.user !== null);
};
