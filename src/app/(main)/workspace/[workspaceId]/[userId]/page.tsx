"use client";
import UserPage from "@/features/users/components/user-page";
import { useParams } from "next/navigation";
import { Id } from "../../../../../../convex/_generated/dataModel";

const UserIdPage = () => {
  const { userId }: { userId: Id<"users"> } = useParams();

  return (
    <>
      <UserPage userId={userId} />
    </>
  );
};

export default UserIdPage;
