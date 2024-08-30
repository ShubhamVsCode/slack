import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useCreateWorkspace } from "../api/actions";
import { toast } from "sonner";

const CreateWorkspaceDialog = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const createWorkspace = useCreateWorkspace();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createWorkspace({ workspaceName });
    if (result) {
      toast.success("Workspace created successfully");
    } else {
      toast.error("Failed to create workspace");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Workspace</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to get started
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label>Workspace Name</Label>
            <Input
              className="w-full"
              onChange={(e) => setWorkspaceName(e.target.value)}
              value={workspaceName}
              placeholder="My Workspace e.g. 'Personal', 'Work'"
              required
            />
          </div>
          <Button type="submit">Create Workspace</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
