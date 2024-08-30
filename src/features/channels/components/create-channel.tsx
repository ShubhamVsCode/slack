import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useCreateChannel } from "../api/actions";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import { useRouter } from "next/navigation";

const CreateChannel = () => {
  const router = useRouter();
  const workspaceId = useGetWorkspaceId();
  const createChannel = useCreateChannel();
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState<"public" | "private">(
    "public",
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const channelId = await createChannel({
      name: channelName,
      visibility: channelType,
      workspaceId,
    });
    if (channelId) {
      toast.success("Channel created successfully");
      router.push(`/workspace/${workspaceId}/channels/${channelId}`);
    } else {
      toast.error("Failed to create channel");
    }

    setChannelName("");
    setChannelType("public");
    handleClose();
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleOpen}
        className="w-full justify-start"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Channel
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Channel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="channelName" className="text-right">
                  Name
                </Label>
                <Input
                  id="channelName"
                  placeholder="Channel Name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <RadioGroup
                  value={channelType}
                  onValueChange={(value) =>
                    setChannelType(value as "public" | "private")
                  }
                  className="col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
