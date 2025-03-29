// import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }: { params: { reviewId: string } }) {
  const reviewId = params.reviewId;

  return {
    title: "ライブの席レポ投稿しました！",
    description: "口コミ内容をぜひチェックしてね🎤",
    openGraph: {
      title: "ライブの席レポ投稿しました！",
      description: "口コミ内容をぜひチェックしてね🎤",
      images: [`https://sekirepo.com/api/og/review/${reviewId}`],
    },
    twitter: {
      card: "summary_large_image",
      title: "ライブの席レポ投稿しました！",
      description: "口コミ内容をぜひチェックしてね🎤",
      images: [`https://sekirepo.com/api/og/review/${reviewId}`],
    },
  };
}
