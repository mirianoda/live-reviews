"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  FaStar,
} from "react-icons/fa";
import IconRatingDisplay from "@/app/components/IconRatingDisplay";
import Image from "next/image";

type ReviewType = {
  id: string;
  user_id: string;
  venue_id: string;
  seat_number: string;
  artist: string;
  visibility: number;
  v_comment: string;
  sound: number;
  s_comment: string;
  facilities: number;
  f_comment: string;
  access: number;
  a_comment: string;
  created_at: string;
};

type ReviewWithUser = ReviewType & {
  users: {
    username: string;
    avatar_url: string;
  };
};

export default function ReviewsList({ venueId }: { venueId: string }) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    seat_number: "",
    artist: "",
    visibility: 0, v_comment: "",
    sound: 0, s_comment: "",
    facilities: 0, f_comment: "",
    access: 0, a_comment: "",
  });

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, users(username, avatar_url)") // ← Joinでユーザー情報取得
        .eq("venue_id", venueId);
    
      if (error) {
        console.error("レビュー取得エラー", error);
      } else if (data) {
        setReviews(data as ReviewWithUser[]);
      }
    };

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchReviews();
    fetchUser();
  }, [venueId]);

  // 🔹 口コミを削除する
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      alert("削除に失敗しました: " + error.message);
    } else {
      alert("口コミを削除しました");
      setReviews(reviews.filter((review) => review.id !== id));
    }
  };

  // 🔹 口コミの編集開始
  const handleEditStart = (review: ReviewType) => {
    setEditReviewId(review.id);
    setEditData({
      seat_number: review.seat_number,
      artist: review.artist,
      visibility: review.visibility,
      v_comment: review.v_comment,
      sound: review.sound,
      s_comment: review.s_comment,
      facilities: review.facilities,
      f_comment: review.f_comment,
      access: review.access,
      a_comment: review.a_comment,
    });
  };

  // 🔹 口コミの編集を保存
  const handleEditSave = async (id: string) => {
    const { error } = await supabase.from("reviews").update(editData).eq("id", id);
    if (error) {
      alert("編集に失敗しました: " + error.message);
    } else {
      alert("口コミを編集しました");
      setReviews(reviews.map((r) => (r.id === id ? { ...r, ...editData } : r)));
      setEditReviewId(null);
    }
  };

  return (
    <div className="mt-6 text-gray-700">
      <h2 className="text-xl  font-bold">口コミ一覧</h2>
      {reviews.length === 0 ? (
        <p>まだ口コミはありません</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="p-4 mt-2 rounded-md bg-white shadow-md relative">
            {editReviewId === review.id ? (
              <>
                <label className="block mt-2">
                  <input type="text" value={editData.seat_number} onChange={(e) => setEditData({ ...editData, seat_number: e.target.value })} className="border rounded w-full p-2 mt-1" />
                </label>

                <label className="block mt-2">
                  アーティスト名:
                  <input type="text" value={editData.artist} onChange={(e) => setEditData({ ...editData, artist: e.target.value })} className="border rounded w-full p-2 mt-1" />
                </label>

                <label className="block mt-2">
                  見やすさ（0〜5）:
                  <input type="number" min="0" max="5" value={editData.visibility} onChange={(e) => setEditData({ ...editData, visibility: Number(e.target.value) })} className="border rounded w-full p-2 mt-1" />
                </label>
                <label className="block mt-1">
                  コメント:
                  <textarea value={editData.v_comment} onChange={(e) => setEditData({ ...editData, v_comment: e.target.value })} className="border rounded w-full p-2 mt-1" />
                </label>

                <label className="block mt-2">
                  音響（0〜5）:
                  <input type="number" min="0" max="5" value={editData.sound} onChange={(e) => setEditData({ ...editData, sound: Number(e.target.value) })} className="border rounded w-full p-2 mt-1" />
                </label>
                <label className="block mt-1">
                  コメント:
                  <textarea value={editData.s_comment} onChange={(e) => setEditData({ ...editData, s_comment: e.target.value })} className="border rounded w-full p-2 mt-1" />
                </label>

                <label className="block mt-2">
                  周辺施設（0〜5）:
                  <input type="number" min="0" max="5" value={editData.facilities} onChange={(e) => setEditData({ ...editData, facilities: Number(e.target.value) })} className="border rounded w-full p-2 mt-1" />
                </label>
                <label className="block mt-1">
                  コメント:
                  <textarea value={editData.f_comment} onChange={(e) => setEditData({ ...editData, f_comment: e.target.value })} className="border rounded w-full p-2 mt-1" />
                </label>

                <label className="block mt-2">
                  アクセス（0〜5）:
                  <input type="number" min="0" max="5" value={editData.access} onChange={(e) => setEditData({ ...editData, access: Number(e.target.value) })} className="border rounded w-full p-2 mt-1" />
                </label>
                <label className="block mt-1">
                  コメント:
                  <textarea value={editData.a_comment} onChange={(e) => setEditData({ ...editData, a_comment: e.target.value })} className="border rounded w-full p-2 mt-1" />
                </label>

                <button onClick={() => handleEditSave(review.id)} className="bg-green-500 text-white p-1 rounded mt-2">
                  保存
                </button>
              </>
            ) : (
              <>
              {/* ユーザー情報＋投稿日 */}

              <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={review.users?.avatar_url || "/logo/default-avatar.png"}
                      alt="ユーザーアイコン"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 outline outline-1 outline-offset-2 outline-gray-400"
                    />
                    <span className="text-sm text-gray-800 font-semibold">
                      {review.users?.username || "匿名ユーザー"}
                    </span>
                  </div>
                  <div className="space-x-2 mb-2 ml-5">
                    <span className="text-sm bg-emerald-100 p-1 rounded"> {review.seat_number}</span>
                    <span className="text-sm bg-blue-100 p-1 rounded"> {review.artist}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>


              <div>
                <div className="mb-2">
                  <div className="flex"><span className="mr-2 text-base font-bold">見やすさ</span><IconRatingDisplay rating={review.visibility} icon={<FaStar className="text-yellow-400" />} size="text-lg" /></div>
                  <p>{review.v_comment}</p>
                </div>
                <div className="mb-2">
                  <div className="flex"><span className="mr-2 text-base font-bold">音響</span><IconRatingDisplay rating={review.sound} icon={<FaStar className="text-yellow-400" />} size="text-lg" /></div>
                  <p>{review.s_comment}</p>
                </div>
                <div className="mb-2">
                  <div className="flex"><span className="mr-2 text-base font-bold">周辺施設</span><IconRatingDisplay rating={review.facilities} icon={<FaStar className="text-yellow-400" />} size="text-lg" /></div>
                  <p>{review.f_comment}</p>
                </div>
                <div>
                  <div className="flex"><span className="mr-2 text-base font-bold">アクセス</span><IconRatingDisplay rating={review.access} icon={<FaStar className="text-yellow-400" />} size="text-lg" /></div>
                  <p>{review.a_comment}</p>
                </div>
              </div>
              </>
            )}

            {user && user.id === review.user_id && (
              <div className="absolute bottom-3 right-4 flex space-x-2">
                <button onClick={() => handleEditStart(review)} className="bg-gray-500 text-white py-0.5 px-2 rounded text-xs">
                  編集
                </button>
                <button onClick={() => handleDelete(review.id)} className="bg-gray-500 text-white py-0.5 px-2 rounded text-xs">
                  削除
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
