"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

// サインアップ処理
const handleSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert("エラー: " + error.message);
    return;
  }

  if (data.user) {
    // 🔹 `users` テーブルにデータを追加
    const { error: userError } = await supabase.from("users").insert([
      {
        id: data.user.id, // 🔥 auth.users の ID を users テーブルにコピー
        username: email.split("@")[0], // 仮のユーザー名（メールの@前を使う）
        avatar_url: "",
      },
    ]);

    if (userError) {
      alert("ユーザーデータの保存に失敗しました: " + userError.message);
    } else {
      alert("登録成功！ログインしてください。");
    }
  }
};

  // ログイン処理
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("エラー: " + error.message);
    } else {
      alert("ログイン成功！");
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">ログイン / サインアップ</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        className="w-full p-2 border rounded mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        className="w-full p-2 border rounded mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp} className="w-full bg-blue-500 text-white p-2 rounded">
        サインアップ
      </button>
      <button onClick={handleSignIn} className="w-full bg-green-500 text-white p-2 rounded mt-2">
        ログイン
      </button>
    </div>
  );
}
