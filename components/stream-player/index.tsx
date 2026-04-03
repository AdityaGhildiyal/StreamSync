"use client";

import { Stream, User } from "@prisma/client";
import { LiveKitRoom } from "@livekit/components-react";

import { useViewerToken } from "@/hooks/use-viewer-token";

import { AboutCard } from "./about-card";
import { InfoCard } from "./info-card";
import { Video, VideoSkeleton } from "./video";
import { Header, HeaderSkeleton } from "./header";

type CustomStream = {
  id: string;
  isLive: boolean;
  thumbnailUrl: string | null;
  name: string;
};

type CustomUser = {
  id: string;
  username: string;
  bio: string | null;
  stream: CustomStream | null;
  imageUrl: string;
};

interface StreamPlayerProps {
  user: CustomUser;
  stream: CustomStream;
}

export const StreamPlayer = ({
  user,
  stream,
}: StreamPlayerProps) => {
  const {
    token,
    name,
    identity,
  } = useViewerToken(user.id);

  if (!token || !name || !identity) {
    return <StreamPlayerSkeleton />
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className="h-full"
    >
      <div className="space-y-4 pb-10 overflow-y-auto hidden-scrollbar">
        <Video
          hostName={user.username}
          hostIdentity={user.id}
        />
        <Header
          hostName={user.username}
          hostIdentity={user.id}
          viewerIdentity={identity}
          imageUrl={user.imageUrl}
          name={stream.name}
        />
        <InfoCard
          hostIdentity={user.id}
          viewerIdentity={identity}
          name={stream.name}
          thumbnailUrl={stream.thumbnailUrl}
        />
        <AboutCard
          hostName={user.username}
          hostIdentity={user.id}
          viewerIdentity={identity}
          bio={user.bio}
        />
      </div>
    </LiveKitRoom>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="space-y-4 pb-10">
      <VideoSkeleton />
      <HeaderSkeleton />
    </div>
  );
}