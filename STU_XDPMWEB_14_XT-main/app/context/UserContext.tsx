"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe } from "../utils/auth";

// ✅ định nghĩa type User
interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  avatar_url?:string;
  phone: string;
  address: string;
  posts: any[]; // hoặc Post[] nếu bạn import type
}

// ✅ định nghĩa context type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUser: () => Promise<void>;
  isReady: boolean;
};

// ✅ KHÔNG dùng any nữa
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const fetchUser = async () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsReady(true);
        return;
      } catch (error) {
        console.error("Không đọc được user từ localStorage:", error);
      }
    }

    const me = await getMe();

    if (me) {
      const nextUser = me.data ?? me.user ?? me;
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      setUser(null);
    }

    setIsReady(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, isReady }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ custom hook an toàn
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};