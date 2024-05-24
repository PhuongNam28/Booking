import React from "react";
import moment from "moment";
import Image from "next/image";

interface UserData {
  id: string;
  avatarUrl: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  image?: string;
  time: any; // You should replace 'any' with the appropriate type for your timestamp
}

interface Props {
  message: Message;
  me: UserData;
  other: UserData;
}

function MessageCard({ message, me, other }: Props) {
  const isMessageFromMe = message.sender === me.id;

  const formatTimeAgo = (timestamp: any) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  return (
    <div
      key={message.id}
      className={`flex mb-4 ${
        isMessageFromMe ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar on the left or right based on the sender */}
      <div className={`w-10 h-10 ${isMessageFromMe ? "ml-2 mr-2" : "mr-2"}`}>
        {isMessageFromMe ? (
          <Image
            className="object-cover rounded-full"
            src={me.avatarUrl}
            alt="Avatar"
            width={100}
            height={100}
          />
        ) : (
          <Image
            className="object-cover rounded-full"
            src={other.avatarUrl}
            alt="Avatar"
            width={100}
            height={100}
          />
        )}
      </div>

      {/* Message bubble on the right or left based on the sender */}
      <div
        className={` text-white p-2 rounded-md ${
          isMessageFromMe ? "bg-blue-500 self-end" : "bg-[#19D39E] self-start"
        }`}
      >
        {message.image && (
          <Image
            src={message.image}
            alt="message"
            width={200}
            height={200}
            className="mb-4"
          />
        )}
        <p>{message.content}</p>
        <div className="text-xs text-gray-200">
          {formatTimeAgo(message.time)}
        </div>
      </div>
    </div>
  );
}

export default MessageCard;
