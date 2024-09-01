"use client";
import {
  useGetWorkspace,
  useGetWorkspaces,
} from "@/features/workspaces/api/actions";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import MainSidebar from "@/features/channels/components/main-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CreateWorkspaceDialog from "@/features/workspaces/components/create-workspace";

const Sidebar = () => {
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });
  const workspaces = useGetWorkspaces();

  return (
    <>
      <div className="flex h-screen w-20 flex-col gap-2 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <DropdownMenu>
          <div className="flex h-20 items-center justify-center">
            <DropdownMenuTrigger>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 text-2xl font-bold text-neutral-500 dark:bg-neutral-800">
                {workspace?.name?.[0]}
              </div>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces?.map((workspace) => (
              <Link href={`/workspace/${workspace._id}`} key={workspace._id}>
                <DropdownMenuItem className="group w-full flex items-center gap-2 cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 group-hover:bg-neutral-700 text-2xl font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500">
                    {workspace?.name?.[0]}
                  </div>
                  {workspace.name}
                </DropdownMenuItem>
              </Link>
            ))}
            <CreateWorkspaceDialog />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <MainSidebar />
    </>
  );
};

export default Sidebar;
