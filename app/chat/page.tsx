"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { app, firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserList } from "@/components/user/UserList"; // Assuming UserList is a better name for user listing
import { ChatRoom } from "@/components/chat/ChatRoom";

// Define the structure of your user data here
interface User {
  email: string;
  id: string;
  name: string;
  avatarUrl: string;
  // Add any other fields you have in your Firestore user document
}

// Define the structure for selected chatroom
interface Chatroom {
  id: string;
  // Add other chatroom related fields
}

export default function Chat() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userRef = doc(firestore, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = {
              email: firebaseUser.email || "",
              id: userSnap.id,
              name: userSnap.data().name || "",
              avatarUrl: userSnap.data().avatarUrl || "",
              // Add any other fields you have in your Firestore user document
            } as User;
            setUser(userData);
          } else {
            setUser(null); // Handle case where user data is undefined
          }
        } else {
          setUser(null);
          router.push("/login");
        }
      }
    );
    return () => unsubscribe();
  }, [auth, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-3/12">
        <UserList userData={user} setSelectedChatroom={setSelectedChatroom} />
      </div>
      <div className="flex-grow">
        <ChatRoom user={user} selectedChatroom={selectedChatroom} />
      </div>
    </div>
  );
}
