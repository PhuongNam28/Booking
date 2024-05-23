import Image from "next/image";
import React from "react";

interface UserCardProps {
  name: string;
  avatarUrl: string;
  latestMessage: string | null;
  type: string;
  time: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  avatarUrl,
  latestMessage,
  time,
  type,
}) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <Image
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className="rounded-full mr-4"
        width={50}
        height={50}
      />
      {type === "chat" && (
        <>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{name}</h2>
              <span className="text-xs text-gray-500">{time}</span>
            </div>
            <p className="text-sm text-gray-500 truncate">{latestMessage}</p>
          </div>
        </>
      )}

      {type === "users" && (
        <>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{name}</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
