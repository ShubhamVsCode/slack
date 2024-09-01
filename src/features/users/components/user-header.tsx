import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { ChevronDown, Dot } from "lucide-react";
import React from "react";

interface UserHeaderProps {
  name: string;
  image: string;
  lastSeen: number;
  onClick: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  name,
  image,
  lastSeen,
  onClick,
}) => {
  const isOnline = lastSeen && dayjs().diff(dayjs(lastSeen), "second") < 7;

  return (
    <div className="h-[60.8px] px-2 border-b flex justify-between items-center">
      <div className="flex items-center">
        {name ? (
          <Button
            variant="ghost"
            className="flex items-center text-xl font-bold px-2 relative"
            onClick={onClick}
          >
            <Avatar className="w-7 h-7 rounded-lg mr-2">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="uppercase rounded-lg">
                {name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <Dot className="w-2 h-2 bg-green-500 rounded-full absolute bottom-1 left-7" />
            )}
            {name}
            <ChevronDown className="ml-2 size-4" />
          </Button>
        ) : (
          <div className="h-7 w-32 bg-gray-900 animate-pulse rounded"></div>
        )}
      </div>
    </div>
  );
};
