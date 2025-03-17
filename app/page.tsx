"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>ログイン状態確認</h1>
      {user ? (
        <p>ログイン中: {user.email}</p>
      ) : (
        <p>ログインしていません</p>
      )}
    </div>
  );
}
