import React, { useEffect, useRef } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageContent } from "@/features/channels/components/message-list";

interface MessageListProps {
  messages: {
    sender: {
      _id: Id<"users">;
      name: string;
      image: string | undefined;
    };
    recipient: {
      _id: Id<"users">;
      name: string;
      image: string | undefined;
    };
    _id: Id<"messages">;
    _creationTime: number;
    content: string;
  }[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?._id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log(messages);

  if (!messages) return null;

  return (
    <ScrollArea className="flex-1 overflow-y-auto mt-2">
      {messages?.reduce((acc, message, index, array) => {
        const prevMessage = index > 0 ? array[index - 1] : null;
        const isSameUser =
          prevMessage && prevMessage.sender._id === message.sender._id;
        const isCurrentUser = message.sender._id === currentUserId;

        let messageContent;
        if (!isSameUser) {
          messageContent = (
            <div key={message._id} className="hover:bg-zinc-800 px-4 py-1">
              <div className="flex gap-2 items-start">
                <Avatar className="w-7 h-7 rounded-lg">
                  <AvatarImage
                    src={message.sender.image}
                    alt={message.sender.name}
                  />
                  <AvatarFallback className="uppercase rounded-lg">
                    {message.sender.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-semibold text-gray-500">
                    {isCurrentUser ? "You" : message.sender.name}{" "}
                    <span className="font-light text-xs">
                      {dayjs(message._creationTime).format("HH:mm")}
                    </span>
                  </div>
                  <MessageContent content={message.content} />
                </div>
              </div>
            </div>
          );
        } else {
          messageContent = (
            <div
              key={message._id}
              className="pl-[52px] text-sm transition-all hover:bg-zinc-800 p-1"
            >
              <MessageContent content={message.content} />
            </div>
          );
        }

        acc.push(messageContent);
        return acc;
      }, [] as React.ReactNode[])}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};
