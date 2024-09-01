import { useState, useEffect } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { User } from "@auth/core/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetUser = (userId: Id<"users">) => {
  const user = useQuery(api.dms.getUser, { userId });
  return user;
};

export const useGetDirectMessages = (
  recipientId: Id<"users">,
  workspaceId: Id<"workspaces">,
) => {
  const messages = useQuery(api.dms.getDirectMessages, {
    recipientId,
    workspaceId,
  });
  return messages;
};

export const useSendDirectMessage = () => {
  const sendDirectMessage = useMutation(api.dms.createDirectMessage);
  return sendDirectMessage;
};

export const useEditDirectMessage = () => {
  const editDirectMessage = useMutation(api.dms.editDirectMessage);
  return editDirectMessage;
};

export const useDeleteDirectMessage = () => {
  const deleteDirectMessage = useMutation(api.dms.deleteDirectMessage);
  return deleteDirectMessage;
};
