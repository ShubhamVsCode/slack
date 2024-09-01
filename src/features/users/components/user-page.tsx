import React, { useState } from "react";
import {
  useGetUser,
  useGetDirectMessages,
  useSendDirectMessage,
} from "../api/actions";
import { Id } from "../../../../convex/_generated/dataModel";
import { MessageList } from "@/features/users/components/message-list";
import { MessageInput } from "@/features/users/components/message-input";
import { UserHeader } from "@/features/users/components/user-header";
import UserProfile from "./user-profile";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import MessageEditor from "@/features/channels/components/message-input";

const UserPage = ({ userId }: { userId: Id<"users"> }) => {
  const workspaceId = useGetWorkspaceId();
  const user = useGetUser(userId);
  const messages = useGetDirectMessages(userId, workspaceId);
  const sendMessage = useSendDirectMessage();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen flex-1">
      <UserHeader
        name={user?.name || ""}
        image={user?.image || ""}
        lastSeen={user?.lastSeen || 0}
        onClick={() => setOpen((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* @ts-ignore */}
          <MessageList messages={messages || []} />
          <UserProfile userId={userId} open={open} setOpen={setOpen} />
          <MessageEditor
            onSend={(text: string) =>
              sendMessage({
                workspaceId,
                recipientId: userId,
                content: text,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
