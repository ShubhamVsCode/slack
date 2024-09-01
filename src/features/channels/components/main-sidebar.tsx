import { useEffect, useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dot, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import UserButton from "@/features/auth/components/user-button";
import CreateChannel from "./create-channel";
import {
  useGetChannels,
  useGetOnlineStatus,
  useUpdateOnlineStatus,
} from "../api/actions";
import Link from "next/link";
import {
  useGetWorkspace,
  useGetWorkspaces,
} from "@/features/workspaces/api/actions";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateOnlineStatus } from "../../../../convex/users";
import dayjs from "dayjs";

const MainSidebar = () => {
  const router = useRouter();
  const workspaces = useGetWorkspaces();
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });
  const channels = useGetChannels(workspaceId);
  const channelId = useParams().channelId;
  const dmUserId = useParams().userId;
  const members = workspace?.members;
  const currentUser = useCurrentUser();
  const getOnlineStatus = useGetOnlineStatus();
  const updateOnlineStatus = useUpdateOnlineStatus();

  useEffect(() => {
    if (!workspace && workspace !== undefined) {
      if (workspaces?.length === 0) {
        router.push("/");
      } else {
        router.push(`/workspace/${workspaces?.[0]?._id}`);
      }
    }
  }, [workspace, workspaces, router]);

  useEffect(() => {
    if (currentUser) {
      updateOnlineStatus();
      setInterval(() => {
        updateOnlineStatus();
      }, 5000);
    }
  }, [currentUser, updateOnlineStatus]);

  return (
    <div className="w-64 bg-zinc-900 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">{workspace?.name || "Loading..."}</h1>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <h2 className="text-sm font-semibold mb-2">Channels</h2>
          {channels?.map((channel) => (
            <Link
              href={`/workspace/${workspaceId}/channel/${channel._id}`}
              key={channel._id}
            >
              <Button
                key={channel._id}
                variant="ghost"
                className={cn("w-full justify-start mb-1", {
                  "bg-zinc-700": channelId === channel._id,
                })}
              >
                <Hash className="mr-2 h-4 w-4" />
                {channel.name}
              </Button>
            </Link>
          ))}
          <CreateChannel />
          <Separator className="my-4" />
          <h2 className="text-sm font-semibold mb-2">Direct Messages</h2>
          {members?.map((user) => (
            <Link href={`/workspace/${workspaceId}/${user._id}`} key={user._id}>
              <Button
                key={user._id}
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1 flex items-center gap-2 relative",
                  dmUserId === user._id && "bg-zinc-700",
                )}
              >
                <Avatar className={cn("w-6 h-6 rounded-lg")}>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="uppercase rounded-lg">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {user.lastSeen &&
                  dayjs().diff(dayjs(user.lastSeen), "second") < 7 && (
                    <Dot className="w-2 h-2 bg-green-500 rounded-full absolute bottom-1 left-9" />
                  )}
                {user.name} {user._id === currentUser?._id && "(You)"}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <UserButton />
      </div>
    </div>
  );
};

export default MainSidebar;
