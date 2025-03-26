"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { FaStar, FaEye, FaHeadphones, FaStore, FaTrain } from "react-icons/fa";

export default function ReviewPage() {
  const { id: venueId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [artistList, setArtistList] = useState<{ id: string; name: string; kana?: string }[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [customArtistName, setCustomArtistName] = useState("");
  const [visibility, setVisibility] = useState(0);
  const [vComment, setVComment] = useState("");
  const [sound, setSound] = useState(0);
  const [sComment, setSComment] = useState("");
  const [facilities, setFacilities] = useState(0);
  const [fComment, setFComment] = useState("");
  const [access, setAccess] = useState(0);
  const [aComment, setAComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fields = [
    { label: "見やすさ", value: visibility, setValue: setVisibility, comment: vComment, setComment: setVComment, icon: <FaEye />, placeholder: "座席からの推しの見え方はどうだった？どんなメンバーが近くに来た？" },
    { label: "音響", value: sound, setValue: setSound, comment: sComment, setComment: setSComment, icon: <FaHeadphones />, placeholder: "音の聴こえ方や反響はどうだった？MCもしっかり聞き取れた？" },
    { label: "周辺施設", value: facilities, setValue: setFacilities, comment: fComment, setComment: setFComment, icon: <FaStore />, placeholder: "トイレの混雑状況はどうだった？また、近くに売店やロッカーはあった？" },
    { label: "アクセス", value: access, setValue: setAccess, comment: aComment, setComment: setAComment, icon: <FaTrain />, placeholder: "電車/バス/車など、何を使って行ったの？その時の状況や知っておいた方が良いことがあったら、ぜひ共有してね！（混雑状況や臨時情報など）" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("id, name, kana");
      if (!error && data) {
        const sorted = [...data].sort((a, b) => (a.kana || "").localeCompare(b.kana || ""));
        setArtistList(sorted);
      }
    };

    fetchUser();
    fetchArtists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalArtistId = selectedArtistId;

    if (!finalArtistId && customArtistName.trim()) {
      const { data: inserted, error: insertError } = await supabase
        .from("artists")
        .insert({
          name: customArtistName.trim(),
          is_official: false,
          created_by: user?.id ?? null,
        })
        .select()
        .single();

      if (insertError) {
        alert("アーティストの追加に失敗しました");
        setLoading(false);
        return;
      }

      finalArtistId = inserted.id;
    }

    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .insert([
        {
          user_id: user ? user.id : null,
          venue_id: venueId,
          seat_number: seatNumber,
          artist_id: finalArtistId,
          visibility,
          v_comment: vComment,
          sound,
          s_comment: sComment,
          facilities,
          f_comment: fComment,
          access,
          a_comment: aComment,
        },
      ])
      .select()
      .single();

    if (reviewError) {
      alert("投稿に失敗しました: " + reviewError.message);
    } else {
      alert("口コミを投稿しました！");
      router.push(`/review/${reviewData.id}`);
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
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-orange-300 text-center">口コミを投稿</h2>
        {!user && <p className="text-sm text-gray-500 mb-2 text-center">※ゲストとして投稿されます</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-orange-100 p-4 bg-orange-50 rounded">
            <label className="text-sm font-semibold block mb-1">座席番号（英数字は半角）</label>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full p-2 border border-orange-100 rounded"
              placeholder="例:アリーナ5通路B15ブロック7列10番,1塁側スタンド6通路28列289番"
            />
          </div>

          <div className="border border-orange-100 p-4 bg-orange-50 rounded">
            <label className="text-sm font-semibold block mb-2">アーティスト名</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedArtistId ?? ""}
                onChange={(e) => setSelectedArtistId(e.target.value || null)}
                className="p-2 border border-orange-100 bg-white rounded w-full sm:w-1/2"
              >
                <option value="">リストから選択（五十音順）</option>
                {artistList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                value={customArtistName}
                onChange={(e) => setCustomArtistName(e.target.value)}
                className="p-2 border border-orange-100 bg-white rounded w-full sm:w-1/2"
                placeholder="リストにない場合はこちら"
              />
            </div>
          </div>


          {fields.map((item, index) => (
            <div key={index} className="border border-gray-100 p-4 bg-gray-50 rounded">
              <label className="text-sm font-semibold block mb-1 flex items-center gap-2">
                {item.icon} {item.label}
              </label>
              <StarInput value={item.value} onChange={item.setValue} />
              <textarea
                value={item.comment}
                onChange={(e) => item.setComment(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-200 rounded"
                placeholder={item.placeholder}
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
