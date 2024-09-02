import React, { useEffect, useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  useDeleteMessage,
  useEditMessage,
  useGetFileUrl,
} from "../api/actions";
import MessageEditor from "./message-input";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import DeleteConfirmDialog from "./message-delete-dialog";
import { toast } from "sonner";
import Image from "next/image";
import MessageImagesDialog from "./message-images-dialog";
import { CarouselApi } from "@/components/ui/carousel";

interface Message {
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
  files?: Id<"_storage">[];
  fileUrls?: string[];
  channelId: Id<"channels">;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const user = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessageId, setHoveredMessageId] =
    useState<Id<"messages"> | null>(null);
  const [editingMessage, setEditingMessage] = useState(false);
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"messages"> | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);

  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDelete = (messageId: Id<"messages">) => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
    const messageToDelete =
      messages.find((message) => message._id === messageId) || null;
    setDeletingMessage(messageToDelete);
  };

  const onEditMessage = async (messageId: Id<"messages">, content: string) => {
    const editedMessage = await editMessage({ messageId, text: content });
  };

  const onDeleteMessage = async (messageId: Id<"messages">) => {
    const deletedMessage = await deleteMessage({ messageId });
    setIsDeleteDialogOpen(false);
    setDeletingMessage(null);

    if (deletedMessage) {
      toast.success("Message deleted");
    } else {
      toast.error("Failed to delete message");
    }
  };

  const onCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingMessage(null);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [selectedMessageFileUrls, setSelectedMessageFileUrls] = useState<
    string[]
  >([]);

  const renderMessageContent = (message: Message) => (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredMessageId(message._id)}
      onMouseLeave={() => setHoveredMessageId(null)}
    >
      <MessageContent
        content={message.content}
        messageId={message._id}
        isEdited={!!message.editedAt}
        isDeleted={!!message.deletedAt}
        onEditMessage={onEditMessage}
        editing={editingMessage}
        setEditing={setEditingMessage}
        editingMessageId={editingMessageId}
      />
      {message.fileUrls && message.fileUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {message.fileUrls?.map((fileUrl) => (
            <Image
              width={400}
              height={200}
              src={fileUrl}
              alt={fileUrl}
              key={fileUrl}
              className="rounded-md w-auto h-[200px] object-contain"
              onClick={() => {
                setSelectedMessageFileUrls(message.fileUrls || []);
                setIsDialogOpen(true);
                setCurrentImageIndex(message.fileUrls?.indexOf(fileUrl) || 0);
              }}
            />
          ))}
        </div>
      )}
      {hoveredMessageId === message._id &&
        message.createdBy.id === user?._id &&
        !message.deletedAt && (
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
              onClick={() => toggleDelete(message._id)}
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

  const renderMessage = (message: Message, isSameUser: boolean | null) => (
    <div
      key={message._id}
      className={`hover:bg-zinc-800 ${isSameUser ? "pl-[52px] p-1" : "px-4 py-1"}`}
    >
      {!isSameUser && (
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
            {renderMessageContent(message)}
          </div>
        </div>
      )}
      {isSameUser && renderMessageContent(message)}
    </div>
  );

  return (
    <ScrollArea className="flex-1 overflow-y-auto mt-2">
      {messages.reduce((acc: React.ReactNode[], message, index, array) => {
        const prevMessage = index > 0 ? array[index - 1] : null;
        const isSameUser =
          prevMessage && prevMessage.createdBy.id === message.createdBy.id;
        acc.push(renderMessage(message, isSameUser));
        return acc;
      }, [] as React.ReactNode[])}
      <div ref={messagesEndRef} />
      {deletingMessage && !deletingMessage.deletedAt && (
        <DeleteConfirmDialog
          content={deletingMessage.content}
          messageId={deletingMessage._id}
          isEdited={!!deletingMessage.editedAt}
          isOpen={isDeleteDialogOpen}
          onClose={onCancelDelete}
          onConfirm={() => onDeleteMessage(deletingMessage._id)}
        />
      )}
      <MessageImagesDialog
        fileUrls={selectedMessageFileUrls || []}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setCarouselApi={setCarouselApi}
      />
    </ScrollArea>
  );
};

export const MessageContent: React.FC<{
  content: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  messageId: Id<"messages">;
  onEditMessage?: (messageId: Id<"messages">, content: string) => void;
  editing?: boolean;
  setEditing?: (editing: boolean) => void;
  editingMessageId?: Id<"messages"> | null;
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
