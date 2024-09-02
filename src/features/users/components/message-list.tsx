import React, { useEffect, useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import MessageEditor from "@/features/channels/components/message-input";
import { useDeleteDirectMessage, useEditDirectMessage } from "../api/actions";
import DeleteConfirmDialog from "./message-delete-dialog";
import { toast } from "sonner";

interface Message {
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
  _id: Id<"directMessages">;
  _creationTime: number;
  content: string;
  editedAt?: number | undefined;
  deletedAt?: number | undefined;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?._id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"directMessages"> | null>(null);
  const [hoveredMessageId, setHoveredMessageId] =
    useState<Id<"directMessages"> | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const editDirectMessage = useEditDirectMessage();
  const deleteDirectMessage = useDeleteDirectMessage();

  const toggleEditing = (messageId: Id<"directMessages">) => {
    setEditing(!editing);
    setEditingMessageId(editing ? null : messageId);
  };

  const toggleDelete = (messageId: Id<"directMessages">) => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
    const messageToDelete =
      messages.find((message) => message._id === messageId) || null;
    setDeleteMessage(messageToDelete);
  };

  const onEditMessage = (messageId: Id<"directMessages">, content: string) => {
    setEditingMessageId(messageId);
    editDirectMessage({ directMessageId: messageId, content });
    setEditing(true);
  };

  const onDeleteMessage = async (messageId: Id<"directMessages">) => {
    const deletedMessage = await deleteDirectMessage({
      directMessageId: messageId,
    });

    setIsDeleteDialogOpen(false);
    setDeleteMessage(null);
    if (deletedMessage) {
      toast.success("Message deleted");
    } else {
      toast.error("Failed to delete message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages) return null;

  const renderMessageActions = (messageId: Id<"directMessages">) => (
    <div className="absolute -top-4 right-3 border border-zinc-700 rounded-md p-1 bg-zinc-800 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        onClick={() => toggleEditing(messageId)}
        variant="ghost"
        size="icon"
        className="h-5 w-5"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => toggleDelete(messageId)}
        variant="ghost"
        size="icon"
        className="h-5 w-5"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderMessageContent = (
    message: Message,
    isCurrentUser: boolean,
    isSameUser: boolean,
  ) => (
    <div className="w-full text-sm">
      {!isSameUser && (
        <div className="font-semibold text-gray-500">
          {isCurrentUser ? "You" : message.sender.name}{" "}
          <span className="font-light text-xs">
            {dayjs(message._creationTime).format("HH:mm")}
          </span>
        </div>
      )}
      <MessageContent
        content={message.content}
        isEdited={!!message.editedAt}
        isDeleted={!!message.deletedAt}
        messageId={message._id}
        onEditMessage={onEditMessage}
        editing={editing}
        setEditing={setEditing}
        editingMessageId={editingMessageId}
      />
      {hoveredMessageId === message._id &&
        message.sender._id === currentUserId &&
        !message.deletedAt &&
        renderMessageActions(message._id)}
    </div>
  );

  return (
    <ScrollArea className="flex-1 overflow-y-auto mt-2">
      {messages?.reduce((acc, message, index, array) => {
        const prevMessage = index > 0 ? array[index - 1] : null;
        const isSameUser =
          prevMessage && prevMessage.sender._id === message.sender._id;
        const isCurrentUser = message.sender._id === currentUserId;

        const messageClass = isSameUser
          ? "pl-[52px] text-sm transition-all hover:bg-zinc-800 p-1 relative group"
          : "hover:bg-zinc-800 px-4 py-1 relative group flex gap-2";

        const messageContent = (
          <div
            key={message._id}
            className={messageClass}
            onMouseEnter={() => setHoveredMessageId(message._id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            {!isSameUser && (
              <Avatar className="w-7 h-7 rounded-lg">
                <AvatarImage
                  src={message.sender.image}
                  alt={message.sender.name}
                />
                <AvatarFallback className="uppercase rounded-lg">
                  {message.sender.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            {renderMessageContent(message, isCurrentUser, !!isSameUser)}
          </div>
        );

        acc.push(messageContent);
        return acc;
      }, [] as React.ReactNode[])}
      <div ref={messagesEndRef} />
      {deleteMessage && !deleteMessage.deletedAt && (
        <DeleteConfirmDialog
          content={deleteMessage.content}
          messageId={deleteMessage._id}
          isEdited={!!deleteMessage.editedAt}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => onDeleteMessage(deleteMessage._id)}
        />
      )}
    </ScrollArea>
  );
};

export const MessageContent: React.FC<{
  content: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  messageId: Id<"directMessages">;
  onEditMessage?: (messageId: Id<"directMessages">, content: string) => void;
  editing?: boolean;
  setEditing?: (editing: boolean) => void;
  editingMessageId?: Id<"directMessages"> | null;
}> = ({
  content,
  isEdited,
  isDeleted,
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
        onEditMessage && onEditMessage(messageId, content);
        setEditing && setEditing(false);
      }}
      isEditing
      onCancel={() => {
        setEditing && setEditing(false);
      }}
    />
  ) : (
    <div className="flex items-end space-x-1">
      <div
        dangerouslySetInnerHTML={{
          __html: isDeleted
            ? '<span class="text-xs font-semibold italic text-gray-500">This message was deleted by the author</span>'
            : isEdited
              ? content + ' <span class="text-xs text-gray-500">(edited)</span>'
              : content,
        }}
        className="prose dark:prose-invert prose-sm max-w-none prose-p:m-0 prose-ul:m-0 prose-ol:m-0 prose-li:m-0 prose-blockquote:m-0 prose-a:text-blue-400 prose-a:text-sm prose-a:font-medium prose-a:no-underline prose-a:hover:underline"
      />
    </div>
  );
};
