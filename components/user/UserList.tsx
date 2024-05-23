"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserCard } from "./UserCard";
import { getAuth, signOut } from "firebase/auth";
import { app, firestore } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { toast } from "../ui/use-toast";
import moment from "moment";

// Define the interface for the user data
interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

// Define the interface for the chatroom data
interface Chatroom {
  id: string;
  users: string[];
  lastMessage: string | null;
  timestamp: any;
  usersData: { [key: string]: User }; // Thêm trường usersData
}

interface UserListProps {
  userData: User; // Ensure userData is nullable
  setSelectedChatroom: React.Dispatch<React.SetStateAction<any>>;
}

export const UserList: React.FC<UserListProps> = ({
  userData,
  setSelectedChatroom,
}) => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userChatrooms, setUserChatrooms] = useState<Chatroom[]>([]);
  const auth = getAuth(app);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Get all users
  useEffect(() => {
    setLoading(true);
    const usersQuery = query(collection(firestore, "users"));
    const unsubscribe = onSnapshot(
      usersQuery,
      (querySnapshot) => {
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users: ", error);
        toast({
          variant: "destructive",
          description: "Error fetching users!",
        });
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Get chat rooms
  useEffect(() => {
    setLoading2(true);
    if (!userData?.id) return; // Ensure userData exists before accessing its properties
    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );

    const unsubscribe = onSnapshot(chatroomsQuery, (querySnapshot) => {
      const chatrooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chatroom[];
      setUserChatrooms(chatrooms);
      setLoading2(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const createChat = async (user: User) => {
    try {
      // Kiểm tra xem user có hợp lệ không
      if (!user || !user.id || !user.name || !user.avatarUrl) {
        console.error("Invalid user data");
        return;
      }

      // Kiểm tra chatroom đã tồn tại
      const existingChatroomQuery = query(
        collection(firestore, "chatrooms"),
        where("users", "array-contains-any", [user.id, userData.id])
      );

      const existingChatroomSnapshot = await getDocs(existingChatroomQuery);

      // Nếu chatroom đã tồn tại, hiển thị thông báo và kết thúc hàm
      if (existingChatroomSnapshot.docs.length > 0) {
        toast({
          variant: "destructive",
          description: "Chatroom already exists!",
        });
        return;
      }

      // Xây dựng dữ liệu cho chatroom mới
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };

      const chatroomData = {
        users: [userData.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      // Thêm chatroom vào Firestore
      const chatroomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatroomData
      );
      console.log("Chatroom created with id", chatroomRef.id);

      // Đặt tab hiện tại thành Chatrooms
      setActiveTab("Chatrooms");
    } catch (err) {
      // Xử lý lỗi
      console.error("Error creating chatroom:", err);
      toast({
        variant: "destructive",
        description: "Something went wrong!",
      });
    }
  };
  const openChat = (chatroom: Chatroom) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData:
        chatroom.usersData[chatroom.users.find((id) => id !== userData.id)],
    };

    setSelectedChatroom(data);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to login page after successful sign out
        toast({
          variant: "success",
          description: "Signing out success!",
        });
        router.push("/login");
      })
      .catch((error) => {
        // Handle any errors that occur during sign out
        console.error("Error signing out:", error);
        toast({
          variant: "destructive",
          description: "Error signing out!",
        });
      });
  };

  const timestampToString = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return moment(date).fromNow();
  };

  return (
    <div className="shadow-lg h-screen overflow-auto mt-4 mb-20">
      <div className="flex justify-between p-4">
        <Button
          onClick={() => handleTabClick("users")}
          className={
            activeTab === "users"
              ? "bg-black text-white"
              : "bg-blue-300 text-white"
          }
        >
          Users
        </Button>

        <Button
          onClick={() => handleTabClick("Chatrooms")}
          className={
            activeTab === "Chatrooms"
              ? "bg-black text-white"
              : "bg-blue-300 text-white"
          }
        >
          ChatRooms
        </Button>

        <Button onClick={handleLogout}>Log out</Button>
      </div>
      <div>
        {activeTab === "Chatrooms" && (
          <>
            <h1 className="px-4 text-base font-semibold">Chatrooms</h1>
            {loading2 ? (
              <p>Loading...</p>
            ) : (
              userChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  onClick={() => {
                    openChat(chatroom);
                  }}
                >
                  <UserCard
                    name={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ]?.name
                    }
                    avatarUrl={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ]?.avatarUrl
                    }
                    latestMessage={chatroom.lastMessage}
                    time={timestampToString(chatroom.timestamp)}
                    type="chat"
                  />
                </div>
              ))
            )}
          </>
        )}
      </div>

      <div>
        {activeTab === "users" && (
          <>
            <h1 className="px-4 text-base font-semibold">Users</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              users.map(
                (user) =>
                  user.id !== userData?.id && (
                    <div key={user.id} onClick={() => createChat(user)}>
                      <UserCard
                        name={user.name}
                        avatarUrl={user.avatarUrl}
                        latestMessage={""}
                        time="2h ago"
                        type="users"
                      />
                    </div>
                  )
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};
