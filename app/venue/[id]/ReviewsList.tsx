"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import IconRatingDisplay from "@/app/components/IconRatingDisplay";
import Image from "next/image";

interface Filters {
  artistId: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  seat: string;
  keyword: string;
}

type ReviewType = {
  id: string;
  user_id: string;
  venue_id: string;
  seat_number: string;
  artist_id: string;
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
  artists: {
    name: string;
  };
};

export default function ReviewsList({ venueId, filters }: { venueId: string; filters: Filters }) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      let query = supabase
        .from("reviews")
        .select("*, users(username, avatar_url), artists(name)")
        .eq("venue_id", venueId);

      if (filters.artistId) {
        query = query.eq("artist_id", filters.artistId);
      }

      if (filters.seat) {
        query = query.ilike("seat_number", `%${filters.seat}%`);
      }

      if (filters.keyword) {
        query = query.or([
          `v_comment.ilike.%${filters.keyword}%`,
          `s_comment.ilike.%${filters.keyword}%`,
          `f_comment.ilike.%${filters.keyword}%`,
          `a_comment.ilike.%${filters.keyword}%`,
        ].join(","));
      }

      if (filters.startYear && filters.startMonth) {
        const startDate = `${filters.startYear}-${filters.startMonth}-01`;
        query = query.gte("created_at", startDate);
      }

      if (filters.endYear && filters.endMonth) {
        const endDate = `${filters.endYear}-${filters.endMonth}-31`;
        query = query.lte("created_at", endDate);
      }

      const { data, error } = await query;

      if (!error && data) {
        setReviews(data as ReviewWithUser[]);
      }
    };

    fetchReviews();
  }, [venueId, filters]);

  if (reviews.length === 0) {
    return <p className="mt-4 text-gray-500">該当する口コミはありません</p>;
  }

  return (
    <div className="mt-6 text-gray-700">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 mt-2 rounded-md bg-white shadow-md hover:bg-[#faf4f2] cursor-pointer"
          onClick={() => router.push(`/review/${review.id}`)}
        >
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
                  {review.users?.username || "ゲストさん"}
                </span>
              </div>
              <div className="space-x-2 mb-2 ml-5">
                <span className="text-sm bg-emerald-100 p-1 rounded"> {review.seat_number}</span>
                <span className="text-sm bg-blue-100 p-1 rounded"> {review.artists?.name || "不明なアーティスト"}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString("ja-JP")}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex"><span className="mr-2 text-base font-bold">見やすさ</span><IconRatingDisplay rating={review.visibility} icon={<FaStar />} size="text-lg" /></div>
            <p>{review.v_comment}</p>
          </div>
          <div className="mb-2">
            <div className="flex"><span className="mr-2 text-base font-bold">音響</span><IconRatingDisplay rating={review.sound} icon={<FaStar />} size="text-lg" /></div>
            <p>{review.s_comment}</p>
          </div>
          <div className="mb-2">
            <div className="flex"><span className="mr-2 text-base font-bold">周辺施設</span><IconRatingDisplay rating={review.facilities} icon={<FaStar />} size="text-lg" /></div>
            <p>{review.f_comment}</p>
          </div>
          <div>
            <div className="flex"><span className="mr-2 text-base font-bold">アクセス</span><IconRatingDisplay rating={review.access} icon={<FaStar />} size="text-lg" /></div>
            <p>{review.a_comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
