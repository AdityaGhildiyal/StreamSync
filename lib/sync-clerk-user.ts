import type { User } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

type ClerkUserPayload = {
  id: string;
  username: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
};

export const syncClerkUserToDb = async (
  clerkUser: User | ClerkUserPayload
) => {
  const username =
    "username" in clerkUser && clerkUser.username
      ? clerkUser.username
      : null;

  if (!username) {
    throw new Error("Clerk user has no username");
  }

  const imageUrl =
    "imageUrl" in clerkUser
      ? clerkUser.imageUrl
      : clerkUser.image_url ?? "";

  return db.user.upsert({
    where: { externalUserId: clerkUser.id },
    create: {
      externalUserId: clerkUser.id,
      username,
      imageUrl,
      stream: {
        create: {
          name: `${username}'s stream`,
        },
      },
    },
    update: {
      username,
      imageUrl,
    },
  });
};
