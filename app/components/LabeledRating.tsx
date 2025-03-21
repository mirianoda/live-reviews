import IconRatingDisplay from "./IconRatingDisplay";
import { ReactNode } from "react";

export default function LabeledRating({
  label,
  icon,
  rating,
}: {
  label: string;        // 例: "見やすさ"
  icon: ReactNode;      // 例: <FaEye />
  rating: number;       // 例: 4.5
}) {
  return (
      <div className="flex items-center space-x-3">
        <span className="w-20 font-semibold">{label}</span>
        <IconRatingDisplay rating={rating} icon={icon}/>
        {/* <span className="text-gray-600 text-sm w-8 text-right">{rating.toFixed(1)}</span> */}
      </div>
  );
}
