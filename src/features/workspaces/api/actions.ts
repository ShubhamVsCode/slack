import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { sendInviteMemberEmail } from "@/lib/email";

export const useCreateWorkspace = () => {
  const createWorkspace = useMutation(api.workspaces.createWorkspace);
  return createWorkspace;
};
export const useGetWorkspace = ({
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
}) => {
  const getWorkspace = useQuery(api.workspaces.getWorkspace, {
    workspaceId,
  });
  return getWorkspace;
};
export const useGetWorkspaces = () => {
  const getWorkspaces = useQuery(api.workspaces.getWorkspaces);
  return getWorkspaces;
};
export const useGetAllWorkspaces = () => {
  const getAllWorkspaces = useQuery(api.workspaces.getAllWorkspaces);
  return getAllWorkspaces;
};
export const useJoinWorkspace = () => {
  const joinWorkspace = useMutation(api.workspaces.joinWorkspace);
  return joinWorkspace;
};
