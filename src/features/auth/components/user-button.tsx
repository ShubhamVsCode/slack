"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useGetWorkspace } from "@/features/workspaces/api/actions";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";

const UserButton = () => {
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });

  const isAdmin = workspace?.createdBy === user?._id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center hover:opacity-80 transition-opacity">
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback className="uppercase">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm font-medium">
            {user?.name} {isAdmin && "(Admin)"}
          </span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <DropdownMenuItem>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
