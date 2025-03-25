import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ReviewsList from "./ReviewsList";
import Header from "../../components/Header";
import {
  FaStar,
  FaEye,
  FaHeadphones,
  FaStore,
  FaTrain,
} from "react-icons/fa";
import LabeledRating from "../../components/LabeledRating";
import IconRatingDisplay from "@/app/components/IconRatingDisplay";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: venueId } = await params;

  // Supabaseから会場の情報を取得
  const { data: venue, error } = await supabase.from("venues").select("*").eq("id", venueId).single();

  if (error) {
    return <p>会場情報の取得に失敗しました</p>;
  }

   // 🔹 レビュー情報の取得
   const { data: reviews, error: reviewError } = await supabase
   .from("reviews")
   .select("visibility, sound, facilities, access")
   .eq("venue_id", venueId);

    if (reviewError) {
      return <p>レビュー情報の取得に失敗しました</p>;
    }
  
  // 🔹 各評価の平均を計算
  const totalReviews = reviews.length;
  const avgVisibility = totalReviews ? reviews.reduce((sum, r) => sum + r.visibility, 0) / totalReviews : 0;
  const avgSound = totalReviews ? reviews.reduce((sum, r) => sum + r.sound, 0) / totalReviews : 0;
  const avgFacilities = totalReviews ? reviews.reduce((sum, r) => sum + r.facilities, 0) / totalReviews : 0;
  const avgAccess = totalReviews ? reviews.reduce((sum, r) => sum + r.access, 0) / totalReviews : 0;

  // 🔹 総合評価（四つの指標の平均）
  const overallRating = (avgVisibility + avgSound + avgFacilities + avgAccess) / 4;

  return (
    <>
    <Header /> {/* 🔹 共通ヘッダーを表示 */}

    <div className="w-screen mx-auto">
      <div style={{ backgroundImage: `url(${venue.image_url})` }} className="bg-cover bg-center h-80 w-full"> 
        <h1 className="text-3xl font-bold pt-10 mx-4 text-white">📍{venue.name}</h1>
        <div className="flex flex-col items-end space-y-3 mx-5 text-sm">
          <p className="mt-2 px-2 py-0.5 bg-white/80 text-gray-700 w-100 rounded">収容人数： {venue.capacity}人</p>
          <p className="mt-2 px-2 py-0.5 bg-white/80 text-gray-700 w-100 rounded">アクセス： {venue.access}</p>
          <p className="mt-2 px-2 py-0.5 bg-white/80 text-gray-700 w-100 rounded">座席タイプ： {venue.seat}</p>
          <a href={venue.website} className="text-blue-500 underline mt-2 block px-2 py-0.5 bg-white/80 w-100 rounded">場内MAP（公式サイト）</a>
        </div>
      </div>

      <div className="px-10 pb-10">
        <div className="flex justify-center pt-5 pb-10">
          {/* 🔹 口コミ投稿ページへ遷移するボタン */}
          <Link href={`/venue/${venueId}/review`} className="text-white py-1 px-15 rounded bg-orange-400 hover:bg-orange-500">
           口コミを投稿する
          </Link>
        </div>

        <div className="p-6 bg-white rounded-4xl border-2 border-amber-500">
          {/* 🔸 総合評価 */}
          <div className="mb-8 flex">
            <h2 className="text-2xl font-bold mr-6 text-gray-700">総合評価</h2>
              <IconRatingDisplay rating={overallRating} icon={<FaStar />} size="text-3xl" />
          </div>

          {/* 🔸 カテゴリ別評価 */}
          <div className="text-gray-700">
            <h2 className="text-lg mb-4">カテゴリ別評価</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledRating label="見やすさ" icon={<FaEye />} rating={avgVisibility} />
              <LabeledRating label="音響" icon={<FaHeadphones />} rating={avgSound} />
              <LabeledRating label="周辺施設" icon={<FaStore />} rating={avgFacilities} />
              <LabeledRating label="アクセス" icon={<FaTrain />} rating={avgAccess} />
            </div>
          </div>
        </div>

        {/* 🔹 口コミ一覧 */}
        <ReviewsList venueId={venueId} />
      </div>

    </div>
    </>
  );
}
