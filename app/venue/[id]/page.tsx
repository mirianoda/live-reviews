import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ReviewsList from "./ReviewsList";
import Header from "../../components/Header";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: venueId } = await params;

  // Supabaseから会場の情報を取得
  const { data: venue, error } = await supabase.from("venues").select("*").eq("id", venueId).single();

  if (error) {
    return <p>会場情報の取得に失敗しました</p>;
  }

  return (
    <>
    <Header /> {/* 🔹 共通ヘッダーを表示 */}

    <div className="w-screen mx-auto bg-white">
      <div style={{ backgroundImage: `url(${venue.image_url})` }} className="bg-cover bg-center h-80 w-full"> 
        <h1 className="text-3xl font-bold pt-10 mx-4 text-white">📍{venue.name}</h1>
        <div className="flex flex-col items-end space-y-4 mx-5">
          <p className="mt-2 px-2 py-1 bg-white/80 text-gray-700 w-100 rounded">収容人数: {venue.capacity}人</p>
          <p className="mt-2 px-2 py-1 bg-white/80 text-gray-700 w-100 rounded">アクセス: {venue.access}</p>
          <p className="mt-2 px-2 py-1 bg-white/80 text-gray-700 w-100 rounded">座席タイプ: {venue.seat}</p>
          <a href={venue.website} className="text-blue-500 underline mt-2 block px-2 py-1 bg-white/80 w-100 rounded">公式サイト</a>
        </div>
      </div>

      <div className="bg-orange-50 px-10 pb-10">
        <div className="flex justify-center py-5">
          {/* 🔹 口コミ投稿ページへ遷移するボタン */}
          <Link href={`/venue/${venueId}/review`} className="text-orange-300 py-1 px-7 rounded border border-orange-300">
           口コミを投稿する
          </Link>
        </div>

        {/* 🔹 口コミ一覧 */}
        <ReviewsList venueId={venueId} />
      </div>

    </div>
    </>
  );
}
