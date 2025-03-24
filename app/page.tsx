"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
// import { User } from "@supabase/supabase-js";
import Header from "./components/Header";
import Link from "next/link";
import Image from "next/image";
import { FaRegHandPointDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

type Venue = {
  id: string;
  name: string;
  image_url: string;
  access: string;
  capacity: number;
  type: string;
};

export default function Home() {
  // const [_user, setUser] = useState<User | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const types = ["ドーム", "スタジアム", "アリーナ"];

  useEffect(() => {
    // const fetchUser = async () => {
    //   const { data, error } = await supabase.auth.getUser();

    //   if (error) {
    //     console.log("ログインしていないため、ゲスト扱い:", error.message);
    //     // setUser(null); // ゲスト用の状態に
    //     return;
    //   }

    //   if (data.user) {
    //     // setUser(data.user);
    //   }
    // };

    const checkAndUpdateConfirmation = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
  
      if (!user) return;
  
      const { data: userData } = await supabase
        .from("users")
        .select("confirmed")
        .eq("id", user.id)
        .single();
  
      if (userData && userData.confirmed === false) {
        await supabase
          .from("users")
          .update({ confirmed: true })
          .eq("id", user.id);
        console.log("メール確認済みに更新しました");
      }
    };

    const fetchVenues = async () => {
      const { data, error } = await supabase.from("venues").select("*");
      if (error) {
        console.error("会場の取得に失敗しました:", error.message);
      } else {
        setVenues(data);
      }
    };
    
    // fetchUser();
    checkAndUpdateConfirmation();
    fetchVenues();
  }, []);

  return (
    <div>
      <Header />

      <div className="max-w-3xl mx-auto p-6 text-center my-15">
        <h1 className="text-2xl font-bold text-orange-400 mb-4">
          座席からの推しの見え方がわかる！
        </h1>
        <Image src="/logo/logo3.png" alt="logo" width={200} height={200} className="m-auto" priority />
        <div className="flex w-full max-w-2xl mx-auto mt-12 rounded-full border border-orange-200 bg-white shadow-md overflow-hidden">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="気になる会場名で検索"
            className="flex-grow px-5 py-3 text-base placeholder-gray-400 focus:outline-none rounded-l-full h-17"
          />
          <button
            className="bg-orange-100 px-5 flex items-center justify-center rounded-r-full
                       transition-transform duration-300 ease-in-out h-17
                       hover:scale-110 active:scale-90"
            aria-label="検索"
          >
            <IoSearch className="text-orange-500 text-2xl drop-shadow-sm" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
      <h2 className="mb-5 text-2xl font-bold flex"><FaRegHandPointDown  className="h-8 w-8 mr-2"/>掲載中の会場一覧</h2>
      {types.map((category) => {
        const filtered = venues.filter(
          (v) =>
            v.type === category &&
            v.name.toLowerCase().includes(search.toLowerCase())
        );
      
        if (filtered.length === 0) return null;
      
        return (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-bold text-orange-500 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filtered.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/venue/${venue.id}`}
                  className="bg-white rounded shadow p-4 border border-orange-100 hover:shadow-md transition-all block"
                >
                  <Image
                    src={venue.image_url || "/no-image.png"}
                    alt={venue.name}
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover rounded-md mb-3"
                    priority
                  />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    {venue.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    収容人数：{venue.capacity}人
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>

    </div>
  );
}
