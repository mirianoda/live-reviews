import IconRatingDisplay from "./IconRatingDisplay";
import { ReactNode } from "react";

export default function LabeledRating({
  label,
  icon,
  rating,
  fullColor = "text-yellow-400",
  halfColor = "text-yellow-300 opacity-70",
  emptyColor = "text-gray-300",
}: {
  label: string;        // 例: "見やすさ"
  icon: ReactNode;      // 例: <FaEye />
  rating: number;       // 例: 4.5
  fullColor?: string;
  halfColor?: string;
  emptyColor?: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <span className="w-20 font-semibold">{label}</span>
      <IconRatingDisplay
        rating={rating}
        icon={icon}
        fullColor={fullColor}
        halfColor={halfColor}
        emptyColor={emptyColor}
      />
    </div>
  );
}
