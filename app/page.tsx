"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Header from "./components/Header";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("ユーザー取得エラー:", error.message);
      }

      if (data.user) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <Header /> {/* 🔹 共通ヘッダーを表示 */}

      <h1>ログイン状態確認</h1>
      {user ? (
        <p>ログイン中: {user.email}</p>
      ) : (
        <p>ログインしていません</p>
      )}
    </div>
  );
}
