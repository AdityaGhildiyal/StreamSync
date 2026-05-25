import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { syncClerkUserToDb } from "@/lib/sync-clerk-user";

export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({
    where: { externalUserId: self.id },
  });

  if (!user) {
    user = await syncClerkUserToDb(self);
  }

  return user;
};

export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  if (self.username !== username) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    user = await syncClerkUserToDb(self);
  }

  return user;
};
