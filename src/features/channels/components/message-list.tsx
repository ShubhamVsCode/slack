import React, { useEffect, useRef } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";

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
    channelId: Id<"channels">;
  }[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mt-2">
      {messages.reduce((acc, message, index, array) => {
        const prevMessage = index > 0 ? array[index - 1] : null;
        const isSameUser =
          prevMessage && prevMessage.createdBy.id === message.createdBy.id;

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
                <div className="text-sm">
                  <div className="font-semibold text-gray-500">
                    {message.createdBy?.name}{" "}
                    <span className="font-light text-xs">
                      {dayjs(message._creationTime).format("HH:mm")}
                    </span>
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            </div>,
          );
        } else {
          acc.push(
            <div
              key={message._id}
              className="pl-[52px] text-sm trasition-all hover:bg-zinc-800 p-1"
            >
              {message.content}
            </div>,
          );
        }

        return acc;
      }, [] as React.ReactNode[])}
      <div ref={messagesEndRef} />
    </div>
  );
};
