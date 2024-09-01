import React, { useState } from "react";
import {
  useGetChannel,
  useGetMessages,
  useSendMessage,
  useEditMessage,
  useDeleteMessage,
} from "../api/actions";
import { Id } from "../../../../convex/_generated/dataModel";
import { MessageList } from "./message-list";
import MessageEditor from "./message-input";
import { ChannelHeader } from "./channel-header";
import { MembersList } from "./member-list";
import ManageChannel from "./manage-channel";

const ChannelPage = ({ channelId }: { channelId: Id<"channels"> }) => {
  const channel = useGetChannel(channelId);
  const messages = useGetMessages(channelId);
  const sendMessage = useSendMessage();
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen flex-1">
      <ChannelHeader
        name={channel?.name || ""}
        description={channel?.description || ""}
        onClick={() => setOpen((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MessageList
            messages={messages || []}
            onEditMessage={(messageId, text) =>
              editMessage({ messageId, text })
            }
            onDeleteMessage={(messageId) => deleteMessage({ messageId })}
          />
          <ManageChannel channelId={channelId} open={open} setOpen={setOpen} />
          <MessageEditor onSend={(text) => sendMessage({ channelId, text })} />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
