"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { FaBars, FaTimes } from "react-icons/fa";

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
  const [menuOpen, setMenuOpen] = useState(false); // 🍔メニューの開閉状態
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ username: string; avatar_url: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setUser(null);
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
    setMenuOpen(false);
    router.push(`/venue/${venueId}`);
  };

  const showSearchUI =
    pathname === "/" || (pathname.startsWith("/venue/") && !pathname.includes("/review")) || "/login" || "/signup";

  return (
    <header className="sticky top-0 bg-white text-black p-4 flex justify-between items-center shadow z-50">
      {/* 🔹 ロゴ */}
      <h1 className="text-xl font-bold">
        <Link href="/">
          <Image src="/logo/logo5.png" alt="logo" width={180} height={40} priority />
        </Link>
      </h1>

      {/* 🍔 ハンバーガーメニューアイコン（モバイル） */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="メニューを開く"
      >
        {menuOpen ? <FaTimes className="text-[#ef866b]" /> : <FaBars className="text-[#ef866b]" />}
      </button>

      {/* 🔹 メニュー（モバイル時はtoggle, PC時は常時表示） */}
      {mounted && (menuOpen || true) && (
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-20 left-0 w-full bg-white px-4 pb-4 space-y-4 md:space-y-0 md:space-x-6 md:static md:flex md:items-center md:w-auto md:bg-transparent z-40`}
        >
          {showSearchUI && (
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                placeholder="🔍 会場を検索"
                className="p-2 rounded border border-[#f9a691] text-black w-full md:w-64"
              />
              {showResults && searchResults.length > 0 && (
                <ul className="absolute left-0 w-full md:w-64 bg-white text-black border rounded mt-1 shadow-lg z-50">
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
          )}

          {/* 👤 ログイン状態による表示切替 */}
          {!user ? (
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login");
                }}
                className="text-[#f9a691] border border-[#f9a691] px-4 py-1 rounded hover:bg-[#fdf8f5]"
              >
                ログイン
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/signup");
                }}
                className="bg-[#f9a691] text-white px-4 py-1 rounded hover:bg-[#ef866b]"
              >
                無料登録
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-xs ml-auto">👋ようこそ、{userData?.username}さん</p>
              <Link href="/mypage" onClick={() => setMenuOpen(false)}>
                <Image
                  src={userData?.avatar_url || "/logo/default-avatar.png"}
                  alt="ユーザーアイコン"
                  width={50}
                  height={50}
                  className="rounded-2xl outline outline-1 outline-[#ef866b] outline-offset-2 cursor-pointer"
                />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
