import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannels = (workspaceId: Id<"workspaces">) => {
  const getChannels = useQuery(api.channels.getChannels, { workspaceId });
  return getChannels;
};

export const useGetChannel = (channelId: Id<"channels">) => {
  const getChannel = useQuery(api.channels.getChannel, { channelId });
  return getChannel;
};

export const useCreateChannel = () => {
  const createChannel = useMutation(api.channels.createChannel);
  return createChannel;
};

export const useGetMessages = (channelId: Id<"channels">) => {
  const getMessages = useQuery(api.channels.getMessages, { channelId });
  return getMessages;
};

export const useSendMessage = () => {
  const sendMessage = useMutation(api.channels.sendMessage);
  return sendMessage;
};

export const useEditMessage = () => {
  const editMessage = useMutation(api.channels.editMessage);
  return editMessage;
};

export const useDeleteMessage = () => {
  const deleteMessage = useMutation(api.channels.deleteMessage);
  return deleteMessage;
};

export const useGetChannelMembers = (channelId: Id<"channels">) => {
  const getChannelMembers = useQuery(api.channels.getChannelMembers, {
    channelId,
  });
  return getChannelMembers;
};

export const useGetOnlineStatus = () => {
  const getOnlineStatus = useQuery(api.users.getOnlineStatus);
  return getOnlineStatus;
};

export const useUpdateOnlineStatus = () => {
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);
  return updateOnlineStatus;
};

export const useGenerateUploadUrl = () => {
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  return generateUploadUrl;
};

export const useGetFileUrl = () => {
  const getFileUrl = useMutation(api.upload.getFileUrl);
  return getFileUrl;
};
