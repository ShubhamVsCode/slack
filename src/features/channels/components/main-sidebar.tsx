import { useState } from "react";
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
import { useGetWorkspace } from "@/features/workspaces/api/actions";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";

const MainSidebar = () => {
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });
  const channels = useGetChannels(workspaceId);
  const [currentChannel, setCurrentChannel] = useState<Doc<"channels"> | null>(
    null,
  );
  const [directMessages, setDirectMessages] = useState<Doc<"users">[]>([]);

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
                className="w-full justify-start mb-1"
              >
                <Hash className="mr-2 h-4 w-4" />
                {channel.name}
              </Button>
            </Link>
          ))}
          <CreateChannel />
          <Separator className="my-4" />
          <h2 className="text-sm font-semibold mb-2">Direct Messages</h2>
          {directMessages.map((user) => (
            <Button
              key={user._id}
              variant="ghost"
              className="w-full justify-start mb-1"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              {user.name}
            </Button>
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
