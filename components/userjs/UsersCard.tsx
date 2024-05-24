import Image from "next/image";
import React from "react";

interface Props {
  avatarUrl: string;
  name: string;
  latestMessage: string | null | undefined;
  time?: string;
  type: "chat" | "user";
}

function UsersCard({ avatarUrl, name, latestMessage, time, type }: Props) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 relative hover:cursor-pointer">
      {/* Avatar on the left */}
      <div className="flex-shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            width={50}
            height={50}
            className="object-cover"
            src={avatarUrl}
            alt="Avatar"
          />
        </div>
      </div>

      {/* Render based on type */}
      {type === "chat" && (
        /* Name, latest message, and time on the right */
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
          <p className="text-gray-500 truncate">{latestMessage}</p>
          {time && <p className="text-gray-500">{time}</p>}
        </div>
      )}

      {type === "user" && (
        /* Name */
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersCard;
