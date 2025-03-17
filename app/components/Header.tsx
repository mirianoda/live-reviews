"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const pathname = usePathname(); // 現在のURLパスを取得
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // 🔹 検索実行（Supabase の類似検索関数を呼び出す）
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchVenues = async () => {
      const { data } = await supabase.rpc("search_venues", { query: searchQuery }); // Supabase の関数を呼び出し

      if (data) setSearchResults(data);
    };

    fetchVenues();
  }, [searchQuery]);

  // 🔹 会場をクリックすると、そのページへ遷移
  const handleSelectVenue = (venueId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    router.push(`/venue/${venueId}`);
  };

  return (
    <header className="sticky top-0 bg-white text-white p-4 flex justify-between items-center relative shadow">
      <h1 className="text-xl font-bold">
        <a href="/"><img src="/logo/logo.png" alt="" className="h-10"/></a>
      </h1>

      {/* 🔹 「会場ページ（/venue/[id]）」だけに検索窓を表示 */}
      {pathname.startsWith("/venue/") && !pathname.includes("/review") && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder="🔍 会場を検索"
            className="p-2 rounded border border-amber-400 text-black w-64 "
          />
          {/* 🔹 検索候補の表示 */}
          {showResults && searchResults.length > 0 && (
            <ul className="absolute left-0 w-64 bg-white text-black border rounded mt-1 shadow-lg">
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
    </header>
  );
}
