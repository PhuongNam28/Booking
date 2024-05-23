import React, { useEffect, useRef, useState } from "react";
import { MessageCard } from "./MessageCard";
import { MessageInput } from "./MessageInput";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "../ui/use-toast";

interface Props {
  user: {
    email: string;
    id: string;
    name: string;
    avatarUrl: string;
  };
  selectedChatroom: any; // Thay any bằng kiểu dữ liệu phù hợp cho selectedChatroom
}

export interface Message {
  id: string;
  sender: string;
  avatarUrl: string;
  content: string;
  time: string;
}

export const ChatRoom: React.FC<Props> = ({ user, selectedChatroom }) => {
  const me = selectedChatroom?.myData; // Correct property name
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Specify the type as Message[]
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (!chatRoomId) {
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messagesData: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          sender: doc.data().sender, // Assuming sender, avatarUrl, content, and time exist in your document
          avatarUrl: doc.data().avatarUrl,
          content: doc.data().content,
          time: doc.data().time,
        }));
        setMessages(messagesData);
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
  }, [chatRoomId]); // Dependency array to ensure the effect runs when chatRoomId changes

  const sendMessage = async () => {
    const messageCollection = collection(firestore, "messages");

    if (message.trim() === "") {
      return;
    }

    try {
      const messageData = {
        chatRoomId,
        senderId: me.id,
        content: message,
        timestamp: serverTimestamp(),
        image: "",
        messageType: "text",
      };

      await addDoc(messageCollection, messageData);
      setMessage("");

      //update

      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastMessage: message,
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Some thing went wrong!",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-10">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            other={other}
            me={me}
          /> // Pass the actual message object
        ))}
      </div>
      <MessageInput
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};
