// app/review/[reviewId]/page.tsx

import ReviewMain from "./ReviewMain"; // ← これで大丈夫！

export async function generateMetadata({ params }: { params: { reviewId: string } }) {
  return {
    title: "ライブの席レポ投稿しました！",
    description: "口コミ内容をぜひチェックしてね🎤",
    openGraph: {
      title: "ライブの席レポ投稿しました！",
      description: "口コミ内容をぜひチェックしてね🎤",
      images: [`https://sekirepo.com/api/og/review/${params.reviewId}`],
    },
    twitter: {
      card: "summary_large_image",
      title: "ライブの席レポ投稿しました！",
      description: "口コミ内容をぜひチェックしてね🎤",
      images: [`https://sekirepo.com/api/og/review/${params.reviewId}`],
    },
  };
}

export default function Page() {
  return <ReviewMain />;
}
