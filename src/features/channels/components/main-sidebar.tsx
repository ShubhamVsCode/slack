import { useEffect, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import UserButton from "@/features/auth/components/user-button";
import CreateChannel from "./create-channel";
import { useGetChannels } from "../api/actions";
import Link from "next/link";
import {
  useGetWorkspace,
  useGetWorkspaces,
} from "@/features/workspaces/api/actions";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MainSidebar = () => {
  const router = useRouter();
  const workspaces = useGetWorkspaces();
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });
  const channels = useGetChannels(workspaceId);
  const channelId = useParams().channelId;
  const members = workspace?.members;
  const currentUser = useCurrentUser();

  const [currentChannel, setCurrentChannel] = useState<Doc<"channels"> | null>(
    null,
  );
  const [directMessages, setDirectMessages] = useState<Doc<"users">[]>([]);

  useEffect(() => {
    if (!workspace && workspace !== undefined) {
      if (workspaces?.length === 0) {
        router.push("/");
      } else {
        router.push(`/workspace/${workspaces?.[0]?._id}`);
      }
    }
  }, [workspace, workspaces, router]);

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
                className="w-full justify-start mb-1 flex items-center gap-2"
              >
                <Avatar
                  className={cn("w-6 h-6 rounded-lg border-2", {
                    // user.status === "online"
                    "border-green-500": false,
                  })}
                >
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="uppercase rounded-lg">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
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
