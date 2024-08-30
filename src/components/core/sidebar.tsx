"use client";
import { useGetWorkspace } from "@/features/workspaces/api/actions";
import MainSidebar from "@/features/channels/components/main-sidebar";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";

const Sidebar = () => {
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });

  return (
    <>
      <div className="flex h-screen w-20 flex-col gap-2 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-20 items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 text-2xl font-bold text-neutral-500 dark:bg-neutral-800">
            {workspace?.name[0]}
          </div>
        </div>
      </div>
      <MainSidebar />
    </>
  );
};

export default Sidebar;
