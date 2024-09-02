import { useState } from "react";
import { useGetChannel, useGetMessages, useSendMessage } from "../api/actions";
import { Id } from "../../../../convex/_generated/dataModel";
import { MessageList } from "./message-list";
import MessageEditor from "./message-input";
import { ChannelHeader } from "./channel-header";
import ManageChannel from "./manage-channel";

const ChannelPage = ({ channelId }: { channelId: Id<"channels"> }) => {
  const channel = useGetChannel(channelId);
  const messages = useGetMessages(channelId);
  const sendMessage = useSendMessage();
  const [open, setOpen] = useState(false);

  if (!channel) return null;

  const channelName = channel?.name || "";
  const placeholder = `Message #${channelName}`;

  return (
    <div className="flex flex-col h-screen flex-1">
      <ChannelHeader
        name={channelName}
        description={channel?.description || ""}
        onClick={() => setOpen((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MessageList messages={messages || []} />
          <ManageChannel channelId={channelId} open={open} setOpen={setOpen} />
          <MessageEditor
            onSend={(text, files) =>
              sendMessage({
                channelId,
                text,
                files,
              })
            }
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
