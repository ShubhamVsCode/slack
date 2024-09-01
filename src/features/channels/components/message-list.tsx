import React, { useEffect, useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useDeleteMessage, useEditMessage } from "../api/actions";
import MessageEditor from "./message-input";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

interface MessageListProps {
  messages: {
    createdBy: {
      id: Id<"users">;
      name: string;
      image: string | undefined;
    };
    _id: Id<"messages">;
    _creationTime: number;
    type: string;
    content: string;
    editedAt?: number | undefined;
    deletedAt?: number | undefined;
    channelId: Id<"channels">;
  }[];
  onEditMessage: (messageId: Id<"messages">, content: string) => void;
  onDeleteMessage: (messageId: Id<"messages">) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onEditMessage,
  onDeleteMessage,
}) => {
  const user = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessageId, setHoveredMessageId] =
    useState<Id<"messages"> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [editingMessage, setEditingMessage] = useState(false);
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"messages"> | null>(null);

  return (
    <ScrollArea className="flex-1 overflow-y-auto mt-2">
      {messages.reduce((acc, message, index, array) => {
        const prevMessage = index > 0 ? array[index - 1] : null;
        const isSameUser =
          prevMessage && prevMessage.createdBy.id === message.createdBy.id;

        const messageContent = (
          <div
            className="relative group"
            onMouseEnter={() => setHoveredMessageId(message._id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <MessageContent
              content={message.content}
              messageId={message._id}
              isEdited={!!message.editedAt}
              onEditMessage={onEditMessage}
              editing={editingMessage}
              setEditing={setEditingMessage}
              editingMessageId={editingMessageId}
            />
            {hoveredMessageId === message._id &&
              message.createdBy.id === user?._id && (
                <div className="absolute -top-4 right-3 border border-zinc-700 rounded-md p-1 bg-zinc-800 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => {
                      if (editingMessage) {
                        setEditingMessage(false);
                        setEditingMessageId(null);
                      } else {
                        setEditingMessage(true);
                        setEditingMessageId(message._id);
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      onDeleteMessage(message._id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
          </div>
        );

        if (!isSameUser) {
          acc.push(
            <div key={message._id} className="hover:bg-zinc-800 px-4 py-1">
              <div className="flex gap-2 items-start">
                <Avatar className="w-7 h-7 rounded-lg">
                  <AvatarImage
                    src={message.createdBy?.image}
                    alt={message.createdBy?.name}
                  />
                  <AvatarFallback className="uppercase rounded-lg">
                    {message.createdBy?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm flex-grow">
                  <div className="font-semibold text-gray-500">
                    {message.createdBy?.name}{" "}
                    <span className="font-light text-xs">
                      {dayjs(message._creationTime).format("HH:mm")}
                    </span>
                  </div>
                  {messageContent}
                </div>
              </div>
            </div>,
          );
        } else {
          acc.push(
            <div
              key={message._id}
              className="pl-[52px] text-sm transition-all hover:bg-zinc-800 p-1"
            >
              {messageContent}
            </div>,
          );
        }

        return acc;
      }, [] as React.ReactNode[])}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export const MessageContent: React.FC<{
  content: string;
  isEdited: boolean;
  messageId: Id<"messages">;
  onEditMessage: (messageId: Id<"messages">, content: string) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  editingMessageId: Id<"messages"> | null;
}> = ({
  content,
  isEdited,
  messageId,
  onEditMessage,
  editing,
  setEditing,
  editingMessageId,
}) => {
  return editing && editingMessageId === messageId ? (
    <MessageEditor
      initialContent={content}
      onSend={(content) => {
        onEditMessage(messageId, content);
        setEditing(false);
      }}
      isEditing
      onCancel={() => {
        setEditing(false);
      }}
    />
  ) : (
    <div className="flex items-end space-x-1">
      <div
        dangerouslySetInnerHTML={{
          __html: isEdited
            ? content + ' <span class="text-xs text-gray-500">(edited)</span>'
            : content,
        }}
        className="prose dark:prose-invert prose-sm max-w-none prose-p:m-0 prose-ul:m-0 prose-ol:m-0 prose-li:m-0 prose-blockquote:m-0 prose-a:text-blue-400 prose-a:text-sm prose-a:font-medium prose-a:no-underline prose-a:hover:underline"
      />
    </div>
  );
};
