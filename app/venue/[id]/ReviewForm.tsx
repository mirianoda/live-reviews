"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function ReviewForm({ venueId, isOpen, onClose }: { venueId: string; isOpen: boolean; onClose: () => void }) {
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
        artist,
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
      setSeatNumber("");
      setArtist("");
      setVisibility(0);
      setVComment("");
      setSound(0);
      setSComment("");
      setFacilities(0);
      setFComment("");
      setAccess(0);
      setAComment("");
      onClose();
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-orange-300 text-center">口コミを投稿</h2>
        {!user && <p className="text-sm text-gray-500 mb-2 text-center">※ゲストとして投稿されます</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <p className="text-sm">座席番号</p>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full p-2 border border-orange-100 bg-orange-50 rounded"
            />
          </label>

          <label className="block mb-4">
            <p className="text-sm">アーティスト名</p>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full p-2 border border-orange-100 bg-orange-50 rounded"
            />
          </label>

          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">評価（0〜5）</h3>

            {[
              { label: "見やすさ", score: visibility, comment: vComment, setScore: setVisibility, setComment: setVComment },
              { label: "音響", score: sound, comment: sComment, setScore: setSound, setComment: setSComment },
              { label: "周辺施設", score: facilities, comment: fComment, setScore: setFacilities, setComment: setFComment },
              { label: "アクセス", score: access, comment: aComment, setScore: setAccess, setComment: setAComment },
            ].map(({ label, score, comment, setScore, setComment }, i) => (
              <div key={i} className="mb-3">
                <label className="block text-sm font-semibold">{label}</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full p-2 mt-1 border border-orange-100 bg-orange-50 rounded"
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full mt-2 p-2 border border-orange-100 bg-orange-50 rounded"
                  placeholder="コメントを入力..."
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-300 text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-400"
          >
            {loading ? "投稿中…" : "口コミを投稿"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-3 bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
