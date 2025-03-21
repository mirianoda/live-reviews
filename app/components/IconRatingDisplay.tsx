"use client";

import { ReactNode } from "react";

export default function IconRatingDisplay({
  rating,
  icon,
  size = "text-xl", // ← 追加！
}: {
  rating: number;
  icon: ReactNode;
  size?: string;
}) {
  const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;  // ← ここ追加！

  const max = 5;
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;
  const empty = max - full - (half ? 1 : 0);

  return (
  <p className="flex items-center space-x-5">
    <p className="flex items-center space-x-1">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`full-${i}`} className={`${size} text-yellow-400`}>{icon}</span>
      ))}
      {half && (
        <span className={`${size} text-yellow-300 opacity-70`}>{icon}</span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} className={`${size} text-gray-300`}>{icon}</span>
      ))}
    </p>
    <span className="text-gray-600 text-sm">{rating.toFixed(1)}</span>
  </p>
  );
}

