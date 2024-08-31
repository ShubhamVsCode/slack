"use client";
import {
  useGetAllWorkspaces,
  useGetWorkspaces,
  useJoinWorkspace,
} from "@/features/workspaces/api/actions";
import { useGetChannels } from "@/features/channels/api/actions";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import CreateWorkspaceDialog from "@/features/workspaces/components/create-workspace";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/workspace";
import { Id } from "../../convex/_generated/dataModel";

export default function Home() {
  const router = useRouter();

  const allWorkspaces = useGetAllWorkspaces();
  const joinWorkspace = useJoinWorkspace();
  const [joinCode, setJoinCode] = useState("");

  const workspaces = useGetWorkspaces();
  const workspaceId = useGetWorkspaceId();

  const searchParams = useSearchParams();
  const paramJoinCode = searchParams.get("joinCode");
  const paramWorkspaceId = searchParams.get("workspaceId");

  const handleJoinWorkspace = async (
    workspaceId: Id<"workspaces">,
    joinCode: string,
  ) => {
    try {
      const workspace = await joinWorkspace({
        joinCode: joinCode.toUpperCase(),
        workspaceId,
      });
      if (workspace) {
        toast.success(`Joined workspace ${workspace.name}`);
        router.push(`/workspace/${workspace._id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to join workspace");
    }
  };

  useEffect(() => {
    if (workspaceId) {
      router.push(`/workspace/${workspaceId}`);
    } else if (workspaces?.[0]) {
      router.push(`/workspace/${workspaces[0]._id}`);
    }
  }, [router, workspaceId, workspaces]);

  useEffect(() => {
    if (paramJoinCode && paramWorkspaceId) {
      setJoinCode(paramJoinCode);
      handleJoinWorkspace(paramWorkspaceId as Id<"workspaces">, paramJoinCode);
    }
  }, [paramJoinCode, paramWorkspaceId]);

  if (!workspaces?.length) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl font-bold mb-8">Welcome to Workplace</h1>
        <div className="w-full max-w-md space-y-4">
          {allWorkspaces?.length ? (
            <h2 className="text-2xl font-semibold text-center">
              Available Workspaces
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold text-center">
              No workspaces found! Create one.
            </h2>
          )}
          <div className="flex justify-center">
            <CreateWorkspaceDialog />
          </div>
          {allWorkspaces?.map((workspace) => (
            <Card key={workspace._id} className="w-full">
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 items-center justify-between">
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    className="text-2xl"
                    value={joinCode}
                    onChange={(value) => {
                      setJoinCode(value);
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot className="w-10 h-12" index={0} />
                      <InputOTPSlot className="w-10 h-12" index={1} />
                      <InputOTPSlot className="w-10 h-12" index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="w-10 h-12" index={3} />
                      <InputOTPSlot className="w-10 h-12" index={4} />
                      <InputOTPSlot className="w-10 h-12" index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <Button
                    onClick={() => handleJoinWorkspace(workspace._id, joinCode)}
                    size={"lg"}
                    className="h-12"
                  >
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Workplace</h1>
    </div>
  );
}
