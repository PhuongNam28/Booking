import React, { useState, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface UserData {
  id: string;
  // Add other properties if needed
  avatarUrl: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  image?: string;
  time: any; // You should replace 'any' with the appropriate type for your timestamp
}

interface SelectedChatroom {
  id: string;
  myData: UserData | null;
  otherData: UserData | null;
}

interface Props {
  user: UserData;
  selectedChatroom: SelectedChatroom;
}

const ChatRoom = ({ user, selectedChatroom }: Props) => {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom && selectedChatroom.id;

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Get messages
  useEffect(() => {
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messagesData);
      }
    );

    return unsubscribe;
  }, [chatRoomId]);

  // Send messages
  const sendMessage = async () => {
    const messagesCollection = collection(firestore, "messages");
    // Check if the message is not empty
    if (!message && !image) {
      return;
    }

    try {
      // Add a new message to the Firestore collection
      const newMessage = {
        chatRoomId: chatRoomId,
        sender: me?.id,
        content: message,
        time: serverTimestamp(),
        image: image,
      };

      await addDoc(messagesCollection, newMessage);
      setMessage("");
      setImage("");
      // Send to chatroom by chatroom id and update last message
      const chatroomRef = chatRoomId
        ? doc(firestore, "chatrooms", chatRoomId)
        : null;
      if (chatroomRef) {
        await updateDoc(chatroomRef, {
          lastMessage: message ? message : "Image",
        });
      }
    } catch (error) {
      console.error("Error sending message:");
    }

    // Scroll to the bottom after sending a message
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  if (!me || !other) {
    // Xử lý trường hợp 'undefined' ở đây, ví dụ:
    console.error("No userData.");
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Messages container with overflow and scroll */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-10">
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            me={me}
            other={other}
          />
        ))}
      </div>

      {/* Input box at the bottom */}
      <MessageInput
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
        image={image}
        setImage={setImage}
      />
    </div>
  );
};

export default ChatRoom;
