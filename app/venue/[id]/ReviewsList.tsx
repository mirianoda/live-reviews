"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReviewsList({ venueId }: { venueId: string }) {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
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
      const { data } = await supabase.from("reviews").select("*").eq("venue_id", venueId);
      if (data) setReviews(data);
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
  const handleEditStart = (review) => {
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
          <div key={review.id} className="p-4 mt-2 rounded-md bg-white shadow-md">
            {editReviewId === review.id ? (
              <>
                <label className="block mt-2">
                  座席番号:
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
                <p>座席: {review.seat_number} / アーティスト: {review.artist}</p>
                <p>見やすさ: {review.visibility} / 5（{review.v_comment}）</p>
                <p>音響: {review.sound} / 5（{review.s_comment}）</p>
                <p>周辺施設: {review.facilities} / 5（{review.f_comment}）</p>
                <p>アクセス: {review.access} / 5（{review.a_comment}）</p>
              </>
            )}

            {user && user.id === review.user_id && (
              <div className="flex space-x-2 mt-2">
                <button onClick={() => handleEditStart(review)} className="bg-yellow-500 text-white p-1 rounded">
                  編集
                </button>
                <button onClick={() => handleDelete(review.id)} className="bg-red-500 text-white p-1 rounded">
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
