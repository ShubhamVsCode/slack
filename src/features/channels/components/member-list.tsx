import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetChannelMembers } from "../api/actions";

interface MembersListProps {
  channelId: Id<"channels">;
}

export const MembersList: React.FC<MembersListProps> = ({ channelId }) => {
  const members = useGetChannelMembers(channelId);

  return (
    <div className="border-l p-4">
      <h3 className="text-lg font-semibold mb-4">Channel Members</h3>
      <ul>
        {members?.map((member) => (
          <li key={member?._id} className="mb-2">
            {member?.userId}
          </li>
        ))}
      </ul>
    </div>
  );
};
