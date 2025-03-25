"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import { User } from "@supabase/supabase-js";
import { FaStar } from "react-icons/fa";

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
      },
    ]);

    if (error) {
      alert("投稿に失敗しました: " + error.message);
    } else {
      alert("口コミを投稿しました！");
      router.push(`/venue/${venueId}`);
    }

    setLoading(false);
  };

  const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex space-x-1 text-orange-300">
      {[1, 2, 3, 4, 5].map((num) => (
        <FaStar
          key={num}
          className={`cursor-pointer w-6 h-6 ${num <= value ? "fill-orange-400" : "fill-gray-300"}`}
          onClick={() => onChange(num)}
        />
      ))}
    </div>
  );

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
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

          {[
            {
              label: "見やすさ",
              value: visibility,
              setValue: setVisibility,
              comment: vComment,
              setComment: setVComment,
            },
            {
              label: "音響",
              value: sound,
              setValue: setSound,
              comment: sComment,
              setComment: setSComment,
            },
            {
              label: "周辺施設",
              value: facilities,
              setValue: setFacilities,
              comment: fComment,
              setComment: setFComment,
            },
            {
              label: "アクセス",
              value: access,
              setValue: setAccess,
              comment: aComment,
              setComment: setAComment,
            },
          ].map((item, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm font-semibold mb-1">{item.label}</p>
              <StarInput value={item.value} onChange={item.setValue} />
              <textarea
                value={item.comment}
                onChange={(e) => item.setComment(e.target.value)}
                className="w-full mt-2 p-2 border border-orange-100 bg-orange-50 rounded"
                placeholder="コメントを入力..."
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-300 text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-400"
          >
            {loading ? "投稿中..." : "口コミを投稿"}
          </button>
        </form>
      </div>
    </>
  );
}
