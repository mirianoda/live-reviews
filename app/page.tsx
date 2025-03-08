import { supabase } from "@/lib/supabaseClient";

async function getReviews() {
  const { data, error } = await supabase.from("reviews").select("*");

  console.log("Fetched Data:", data);  // 🔍 追加！
  console.log("Error:", error);  // 🔍 追加！

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const reviews = await getReviews();

  console.log("Rendered Reviews:", reviews);  // 🔍 追加！

  return (
    <div>
      <h1>口コミ一覧</h1>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.id}>{review.content}（⭐{review.rating}）</li>
          ))
        ) : (
          <p>口コミがありません</p>
        )}
      </ul>
    </div>
  );
}
