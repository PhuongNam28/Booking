import { User } from "@firebase/auth";
import moment from "moment";
import Image from "next/image";

interface Message {
  id: string;
  sender: string;
  avatarUrl: string;
  content: string;
  time: any;
}

interface MessageCardProps {
  message: Message;
  me: User;
  other: User;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  me,
  other,
}) => {
  const isMessageFromMe = message.sender === me.uid;

  const timeAgo = (time: any) => {
    if (!time) return "";
    const date = new Date(time.seconds * 1000);
    return moment(date).fromNow();
  };

  return (
    <div
      key={message.id}
      className={`flex mb-4 ${
        isMessageFromMe ? "justify-end" : "justify-start"
      } items-center`}
    >
      {!isMessageFromMe && message.avatarUrl && (
        <Image
          src={message.avatarUrl}
          alt={`${message.sender}'s avatar`}
          className="rounded-full mr-2"
          width={50}
          height={50}
        />
      )}
      <div
        className={`p-4 rounded-lg max-w-xs ${
          isMessageFromMe ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{message.sender}</span>
          <span className="text-xs text-gray-600">{timeAgo(message.time)}</span>
        </div>
        <p>{message.content}</p>
      </div>
      {isMessageFromMe && message.avatarUrl && (
        <Image
          src={message.avatarUrl}
          alt={`${message.sender}'s avatar`}
          className="rounded-full ml-2 mr-2"
          width={50}
          height={50}
        />
      )}
    </div>
  );
};
