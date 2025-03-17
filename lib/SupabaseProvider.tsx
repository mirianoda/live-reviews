"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const SupabaseContext = createContext(null);

export default function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <SupabaseContext.Provider value={{ user }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useAuth() {
  return useContext(SupabaseContext);
}
