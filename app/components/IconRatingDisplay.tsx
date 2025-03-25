"use client";

import { ReactNode } from "react";

export default function IconRatingDisplay({
  rating,
  icon,
  size = "text-xl",
}: {
  rating: number;
  icon: ReactNode;
  size?: string;
}) {
  const isValidRating = typeof rating === "number" && !isNaN(rating) && rating > 0;
  const safeRating = isValidRating ? rating : 0;

  const max = 5;
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;
  const empty = max - full - (half ? 1 : 0);

  return (
    <div className="flex items-center space-x-5">
      <div className="flex items-center space-x-1">
        {isValidRating ? (
          <>
            {Array.from({ length: full }).map((_, i) => (
              <span key={`full-${i}`} className={`${size} text-yellow-400`}>
                {icon}
              </span>
            ))}
            {half && (
              <span className={`${size} text-yellow-300 opacity-70`}>
                {icon}
              </span>
            )}
            {Array.from({ length: empty }).map((_, i) => (
              <span key={`empty-${i}`} className={`${size} text-gray-300`}>
                {icon}
              </span>
            ))}
          </>
        ) : (
          // 評価がない場合は灰色の星5つ
          Array.from({ length: 5 }).map((_, i) => (
            <span key={`empty-${i}`} className={`${size} text-gray-300`}>
              {icon}
            </span>
          ))
        )}
      </div>
      {/* 数値表示は評価があるときだけ */}
      {isValidRating && (
        <span className="text-gray-600 text-sm">{safeRating.toFixed(1)}</span>
      )}
    </div>
  );
}
