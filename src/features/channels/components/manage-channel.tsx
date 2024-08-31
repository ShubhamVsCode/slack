import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Id } from "../../../../convex/_generated/dataModel";
import dayjs from "dayjs";
import { useGetChannel } from "../api/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendInviteMemberEmail } from "@/lib/email";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import { useGetWorkspace } from "@/features/workspaces/api/actions";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { toast } from "sonner";

const ManageChannel = ({
  channelId,
  open,
  setOpen,
}: {
  channelId: Id<"channels">;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const user = useCurrentUser();
  const workspaceId = useGetWorkspaceId();
  const workspace = useGetWorkspace({ workspaceId });
  const channel = useGetChannel(channelId);
  const [inviteMemberEmail, setInviteMemberEmail] = useState("");

  const handleLeaveChannel = () => {
    setOpen(false);
  };

  const handleDeleteChannel = () => {
    setOpen(false);
  };

  const handleInviteMember = async () => {
    const inviteLink = `${window.location.origin}?workspaceId=${workspaceId}&joinCode=${workspace?.joinCode}`;
    try {
      console.log(inviteLink);
      //   const inviteMemberResponse = await sendInviteMemberEmail(
      //     inviteMemberEmail,
      //     workspace?.name || "",
      //     user?.name || "",
      //     inviteLink,
      //   );
      toast.success("Invited member to the channel");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!channel) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle># {channel.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Tabs defaultValue="about">
            <TabsList className="mb-1">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <div className="border rounded-md py-2">
                <div className="flex flex-col text-sm px-5 py-2">
                  Created by
                  <div className="mt-1">
                    {channel.createdBy?.name} on{" "}
                    <span>
                      {dayjs(channel._creationTime).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <Label htmlFor="name" className="text-sm font-medium px-3">
                    Channel name
                  </Label>
                  <Input
                    id="name"
                    value={channel.name}
                    onChange={(e) => {}}
                    className="border-none"
                    placeholder="Enter the channel name"
                  />
                </div>
                <div className="p-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium px-3"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={channel.description}
                    // onChange={(e) => handleUpdateDescription(e.target.value)}
                    className="border-none"
                    placeholder="Enter the channel description"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="members">
              <div className="border rounded-md py-2">
                <div className="px-5 py-2">
                  <h4 className="font-medium">Members</h4>
                  <div className="flex items-center gap-2 my-1">
                    <Input
                      value={inviteMemberEmail}
                      onChange={(e) => setInviteMemberEmail(e.target.value)}
                      placeholder="Enter the member email"
                    />
                    <Button onClick={handleInviteMember}>Invite Member</Button>
                  </div>

                  <ul>
                    {channel.members?.map((member) => (
                      <li
                        key={member?._id}
                        className="flex items-center gap-2 my-1 text-sm"
                      >
                        <Avatar className="w-6 h-6 rounded-lg">
                          <AvatarImage src={member?.image} alt={member?.name} />
                          <AvatarFallback className="uppercase rounded-lg">
                            {member?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={channel.description}
              onChange={(e) => handleUpdateDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newMember" className="text-right">
              Add Member
            </Label>
            <Input
              id="newMember"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleAddMember}>Add Member</Button>
          <div className="mt-4">
            <h4 className="mb-2 font-medium">Current Members:</h4>
            <ul>
              {channel.members.map((member) => (
                <li
                  key={member}
                  className="flex justify-between items-center mb-2"
                >
                  {member}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Leave Channel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to leave this channel?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. You will need to be re-invited
                  to join the channel again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveChannel}>
                  Leave Channel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Channel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  channel and remove all members.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteChannel}>
                  Delete Channel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageChannel;
