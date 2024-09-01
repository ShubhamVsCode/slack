import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useGetUser } from "../api/actions";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UserProfileProps {
  userId: Id<"users">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, open, setOpen }) => {
  const user = useGetUser(userId);
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <div className="flex flex-col items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-3xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                User ID: {user?._id}
              </p>
            </div>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
