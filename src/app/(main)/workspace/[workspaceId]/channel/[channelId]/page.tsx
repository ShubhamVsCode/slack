"use client";

import ChannelPage from "@/features/channels/components/channel-page";
import { useParams } from "next/navigation";
import { Id } from "../../../../../../../convex/_generated/dataModel";

const ChannelIdPage = () => {
  const { channelId }: { channelId: Id<"channels"> } = useParams();

  return (
    <>
      <ChannelPage channelId={channelId} />
    </>
  );
};

export default ChannelIdPage;
