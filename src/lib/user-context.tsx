"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CurrentAdminUser } from "./types";
import { getStoredUser, setStoredUser } from "./api";

interface UserContextValue {
  user: CurrentAdminUser | null;
  setUser: (u: CurrentAdminUser | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<CurrentAdminUser | null>(null);

  useEffect(() => {
    setUserState(getStoredUser());
  }, []);

  function setUser(u: CurrentAdminUser | null) {
    setStoredUser(u);
    setUserState(u);
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser(): UserContextValue {
  return useContext(UserContext);
}
