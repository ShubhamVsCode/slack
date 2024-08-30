import { Button } from "@/components/ui/button";
import { ChevronDown, Hash } from "lucide-react";
import React from "react";

interface ChannelHeaderProps {
  name: string;
  description: string;
  onClick: () => void;
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({
  name,
  description,
  onClick,
}) => {
  return (
    <div className="h-[60.8px] px-2 border-b flex justify-between items-center">
      <div>
        <div className="flex items-center">
          {name ? (
            <Button
              variant="ghost"
              className="flex items-center text-xl font-bold px-2"
              onClick={onClick}
            >
              <Hash className="mr-2 size-4" />
              {name}
              <ChevronDown className="ml-2 size-4" />
            </Button>
          ) : (
            <div className="h-7 w-32 bg-gray-900 animate-pulse rounded"></div>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
