"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ReviewsList from "./ReviewsList";
import ReviewSearchForm from "./ReviewSearchForm";
import {
  FaStar,
  FaEye,
  FaHeadphones,
  FaStore,
  FaTrain,
} from "react-icons/fa";
import LabeledRating from "../../components/LabeledRating";
import IconRatingDisplay from "@/app/components/IconRatingDisplay";

type Venue = {
  id: string;
  name: string;
  image_url: string;
  capacity: number;
  access: string;
  seat: string;
  website: string;
  type: string;
};

export default function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: venueId } = use(params);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [artistList, setArtistList] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    artistId: "",
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
    seat: "",
    keyword: "",
  });

  useEffect(() => {
    const fetchVenue = async () => {
      const { data } = await supabase.from("venues").select("*").eq("id", venueId).single();
      if (data) setVenue(data);
    };

    const fetchArtists = async () => {
      const { data } = await supabase.from("artists").select("id, name, kana").order("kana");
      if (data) setArtistList(data);
    };

    fetchVenue();
    fetchArtists();
  }, [venueId]);

  const [average, setAverage] = useState({
    visibility: 0,
    sound: 0,
    facilities: 0,
    access: 0,
    overall: 0,
  });

  useEffect(() => {
    const fetchAverages = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("visibility, sound, facilities, access")
        .eq("venue_id", venueId);

      if (data && data.length > 0) {
        const total = data.length;
        const sum = data.reduce(
          (acc, r) => {
            acc.visibility += r.visibility;
            acc.sound += r.sound;
            acc.facilities += r.facilities;
            acc.access += r.access;
            return acc;
          },
          { visibility: 0, sound: 0, facilities: 0, access: 0 }
        );

        setAverage({
          visibility: sum.visibility / total,
          sound: sum.sound / total,
          facilities: sum.facilities / total,
          access: sum.access / total,
          overall: (sum.visibility + sum.sound + sum.facilities + sum.access) / 4 / total,
        });
      }
    };

    fetchAverages();
  }, [venueId]);

  if (!venue) return <p>会場情報を取得中...</p>;

  return (
    <>
      <div className="w-screen mx-auto">
        <div
          style={{ backgroundImage: `url(${venue.image_url})` }}
          className="bg-cover bg-center h-80 w-full"
        >
          <h1 className="text-3xl font-bold pt-10 mx-4 text-white">📍{venue.name}</h1>
          <div className="flex flex-col items-end space-y-3 mx-5 text-sm">
            <p className="mt-2 px-2 py-0.5 bg-white/80 text-gray-700 w-100 rounded">
              収容人数： {venue.capacity}人
            </p>
            <p className="mt-2 px-2 py-0.5 bg-white/80 text-gray-700 w-100 rounded">
              アクセス： {venue.access}
            </p>
            <p className="mt-2 px-2 py-0.5 bg-white/80 text-gray-700 w-100 rounded">
              座席タイプ： {venue.seat}
            </p>
            <a
              href={venue.website}
              className="text-blue-500 underline mt-2 block px-2 py-0.5 bg-white/80 w-100 rounded"
            >
              場内MAP（公式サイト）
            </a>
          </div>
        </div>

        <div className="px-10 pb-10">
          <div className="flex justify-center pt-5 pb-10">
            <Link
              href={`/venue/${venueId}/review`}
              className="text-white py-1 px-15 rounded bg-[#f9a691] hover:bg-[#ef866b]"
            >
              口コミを投稿する
            </Link>
          </div>

          <div className="p-6 bg-white rounded-4xl border-2 border-[#fae4de] mb-10">
            <div className="mb-8 flex">
              <h2 className="text-2xl font-bold mr-6 text-gray-700">総合評価</h2>
              <IconRatingDisplay rating={average.overall} icon={<FaStar />} size="text-3xl" />
            </div>

            <div className="text-gray-700">
              <h2 className="text-lg mb-4">カテゴリ別評価</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LabeledRating label="見やすさ" icon={<FaEye />} rating={average.visibility} fullColor="text-green-500" halfColor="text-green-300" />
                <LabeledRating label="音響" icon={<FaHeadphones />} rating={average.sound} fullColor="text-blue-500" halfColor="text-blue-300" />
                <LabeledRating label="周辺施設" icon={<FaStore />} rating={average.facilities} fullColor="text-pink-500" halfColor="text-pink-300" />
                <LabeledRating label="アクセス" icon={<FaTrain />} rating={average.access} fullColor="text-orange-500" halfColor="text-orange-300" />
              </div>
            </div>
          </div>
          <ReviewSearchForm artistList={artistList} onSearch={setFilters} />
          <ReviewsList venueId={venueId} filters={filters} />
        </div>
      </div>
    </>
  );
}
