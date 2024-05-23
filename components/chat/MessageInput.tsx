import React from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { Input } from "../ui/input";

interface Props {
  message: string;
  sendMessage: () => void;
  setMessage: (message: string) => void;
}

export const MessageInput: React.FC<Props> = ({
  message,
  sendMessage,
  setMessage,
}) => {
  return (
    <div className="flex items-center p-4 border-t border-gray-200">
      <FaPaperclip className="text-gray-500 mr-2 cursor-pointer" />
      <Input
        type="text"
        placeholder="Type a message"
        className="flex-1 border-none p-2 outline-none"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value); // Update message state when input changes
        }}
      />
      <FaPaperPlane
        onClick={sendMessage}
        className="text-gray-500 ml-2 cursor-pointer"
      />
    </div>
  );
};
