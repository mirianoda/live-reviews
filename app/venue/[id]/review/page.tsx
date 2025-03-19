"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import { User } from "@supabase/supabase-js";

export default function ReviewPage() {
  const { id: venueId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [artist, setArtist] = useState("");
  const [visibility, setVisibility] = useState(0);
  const [vComment, setVComment] = useState("");
  const [sound, setSound] = useState(0);
  const [sComment, setSComment] = useState("");
  const [facilities, setFacilities] = useState(0);
  const [fComment, setFComment] = useState("");
  const [access, setAccess] = useState(0);
  const [aComment, setAComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ログインユーザーを取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("reviews").insert([
      {
        user_id: user ? user.id : null,
        venue_id: venueId,
        seat_number: seatNumber,
        artist: artist,
        visibility,
        v_comment: vComment,
        sound,
        s_comment: sComment,
        facilities,
        f_comment: fComment,
        access,
        a_comment: aComment,
      }
    ]);

    if (error) {
      alert("投稿に失敗しました: " + error.message);
    } else {
      alert("口コミを投稿しました！");
      router.push(`/venue/${venueId}`); // 🔹 口コミ投稿後に会場ページへリダイレクト
    }

    setLoading(false);
  };

  return (
    <>
    <Header /> {/* 🔹 共通ヘッダーを適用 */}

    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">口コミを投稿</h2>
      {!user && <p className="text-sm text-gray-500 mb-2">※ゲストとして投稿されます</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          座席番号:
          <input type="text" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} className="border rounded w-full p-2 mt-1" />
        </label>

        <label className="block mb-2">
          アーティスト名:
          <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} className="border rounded w-full p-2 mt-1" />
        </label>

        {/* 各評価項目 */}
        <div className="mt-4">
          <h3 className="font-bold">評価（0〜5）</h3>
          <label className="block mt-2">
            見やすさ:
            <input type="number" min="0" max="5" value={visibility} onChange={(e) => setVisibility(Number(e.target.value))} className="border rounded w-full p-2 mt-1" />
          </label>
          <label className="block mt-1">
            コメント:
            <textarea value={vComment} onChange={(e) => setVComment(e.target.value)} className="border rounded w-full p-2 mt-1" />
          </label>

          <label className="block mt-2">
            音響:
            <input type="number" min="0" max="5" value={sound} onChange={(e) => setSound(Number(e.target.value))} className="border rounded w-full p-2 mt-1" />
          </label>
          <label className="block mt-1">
            コメント:
            <textarea value={sComment} onChange={(e) => setSComment(e.target.value)} className="border rounded w-full p-2 mt-1" />
          </label>

          <label className="block mt-2">
            周辺施設:
            <input type="number" min="0" max="5" value={facilities} onChange={(e) => setFacilities(Number(e.target.value))} className="border rounded w-full p-2 mt-1" />
          </label>
          <label className="block mt-1">
            コメント:
            <textarea value={fComment} onChange={(e) => setFComment(e.target.value)} className="border rounded w-full p-2 mt-1" />
          </label>

          <label className="block mt-2">
            アクセス:
            <input type="number" min="0" max="5" value={access} onChange={(e) => setAccess(Number(e.target.value))} className="border rounded w-full p-2 mt-1" />
          </label>
          <label className="block mt-1">
            コメント:
            <textarea value={aComment} onChange={(e) => setAComment(e.target.value)} className="border rounded w-full p-2 mt-1" />
          </label>
        </div>

        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded w-full" disabled={loading}>
          投稿
        </button>
      </form>
    </div>
    </>
  );
}
