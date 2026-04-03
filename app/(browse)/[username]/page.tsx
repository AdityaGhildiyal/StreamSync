import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
};

const UserPage = async ({
  params
}: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user || !user.stream) {
    notFound();
  }

  return ( 
    <StreamPlayer
      user={user}
      stream={user.stream}
    />
  );
}
 
export default UserPage;