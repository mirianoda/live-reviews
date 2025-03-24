"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user;

        if (!user) {
          console.log("ユーザーセッションがありません");
          return;
        }

        // users テーブルにすでにあるか確認
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingUser) {
          const { error } = await supabase.from("users").insert([
            {
              id: user.id,
              username:
                user.user_metadata.full_name || user.email?.split("@")[0],
              avatar_url: user.user_metadata.avatar_url || "",
            },
          ]);
          if (error) {
            console.error("SNS登録時のusersテーブル保存エラー:", error.message);
          } else {
            console.log("新しいSNSユーザーをusersテーブルに保存しました");
          }
        } else {
          console.log("既存ユーザーなのでusersテーブル登録はスキップ");
        }

        router.push("/");
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return <p className="text-center mt-10">ログイン処理中です...</p>;
}
