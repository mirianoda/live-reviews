"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

type Venue = {
  id: string;
  name: string;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Venue[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [user, setUser] = useState<User | null>(null); // ユーザー情報
  const [userData, setUserData] = useState<{ username: string, avatar_url: string } | null>(null);

  // 🔹 ログイン状態を取得（クライアント側で）
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log("ログインしていないため、ゲスト扱い:", error.message);
        setUser(null); // ゲスト用の状態に
        return;
      }

      if (data.user) {
        setUser(data.user);
      }

      const { data: profile } = await supabase
      .from("users")
      .select("avatar_url, username")
      .eq("id", data.user.id)
      .single();

      if (profile) {
        setUserData(profile);
      }
    };
    getUser();
  }, []);

  // 🔹 類似検索（Supabase RPC関数）
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchVenues = async () => {
      const { data } = await supabase.rpc("search_venues", {
        query: searchQuery,
      });
      if (data) setSearchResults(data);
    };

    fetchVenues();
  }, [searchQuery]);

  const handleSelectVenue = (venueId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    router.push(`/venue/${venueId}`);
  };

  const showSearchUI =
    pathname === "/" || (pathname.startsWith("/venue/") && !pathname.includes("/review")) || "/login" || "/signup";

  return (
    <header className="sticky top-0 bg-white text-black p-4 flex justify-between items-center relative shadow z-50">
      {/* 🔹 ロゴ */}
      <h1 className="text-xl font-bold">
        <Link href="/">
          <Image src="/logo/logo5.png" alt="logo" width={180} height={40} priority />
        </Link>
      </h1>

      {/* 🔹 右側UI：検索 + 認証 */}
      {showSearchUI && (
        <div className="flex items-center space-x-6">
          {/* 🔍 検索窓 */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="🔍 会場を検索"
              className="p-2 rounded border border-[#fae4de] text-black w-64"
            />
            {showResults && searchResults.length > 0 && (
              <ul className="absolute left-0 w-64 bg-white text-black border rounded mt-1 shadow-lg z-50">
                {searchResults.map((venue) => (
                  <li
                    key={venue.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectVenue(venue.id)}
                  >
                    {venue.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 👤 ログイン状態による表示切替 */}
          {!user ? (
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="text-[#fae4de] border border-[#fae4de] px-4 py-1 rounded hover:bg-[#fdf8f5]"
              >
                ログイン
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="bg-[#fae4de] text-white px-4 py-1 rounded hover:bg-[#ef866b]"
              >
                無料登録
              </button>
            </div>
          ) : (
              <>
                <p className="text-xs">👋ようこそ、{userData?.username}さん</p>

                <Link href="/mypage">
                  <Image
                    src={userData?.avatar_url || "/logo/default-avatar.png"}
                    alt="ユーザーアイコン"
                    width={50}
                    height={50}
                    className="rounded-2xl outline outline-1 outline-[#ef866b] outline-offset-2 cursor-pointer"
                  />
                </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
