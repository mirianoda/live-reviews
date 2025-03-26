"use client";

import { useState } from "react";

type Props = {
  onSearch: (filters: {
    artistId: string;
    startYear: string;
    startMonth: string;
    endYear: string;
    endMonth: string;
    seat: string;
    keyword: string;
  }) => void;
  artistList: { id: string; name: string }[];
};

export default function ReviewSearchForm({ onSearch, artistList }: Props) {
  const [artistId, setArtistId] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [seat, setSeat] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((startYear && !startMonth) || (!startYear && startMonth)) {
      alert("開始年月を正しく選択してください");
      return;
    }
    if ((endYear && !endMonth) || (!endYear && endMonth)) {
      alert("終了年月を正しく選択してください");
      return;
    }

    onSearch({ artistId, startYear, startMonth, endYear, endMonth, seat, keyword });
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      <h2 className="text-xl font-bold shrink-0">口コミ一覧</h2>
      <form onSubmit={handleSubmit} className="p-3 rounded text-sm w-full sm:w-auto">
        <div className="flex flex-wrap items-end gap-3">
          <input
            type="text"
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
            placeholder="座席"
            className="p-1 px-2 w-28 border border-[#f9a691] rounded text-sm bg-white"
          />
  
          <select
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            className="p-1 px-2 w-36 border border-[#f9a691] rounded bg-white text-sm"
          >
            <option value="">アーティスト名</option>
            {artistList.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
  
          <div className="flex items-center gap-1">
            <label className="text-xs mr-1">期間指定:</label>
            <select value={startYear} onChange={(e) => setStartYear(e.target.value)} className="p-1 border border-[#f9a691] rounded text-sm bg-white">
              <option value="">年</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}年</option>;
              })}
            </select>
            <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="p-1 border border-[#f9a691] rounded text-sm bg-white">
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}月</option>
              ))}
            </select>
            <span className="mx-1">〜</span>
            <select value={endYear} onChange={(e) => setEndYear(e.target.value)} className="p-1 border border-[#f9a691] rounded text-sm bg-white">
              <option value="">年</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}年</option>;
              })}
            </select>
            <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="p-1 border border-[#f9a691] rounded text-sm bg-white">
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}月</option>
              ))}
            </select>
          </div>
  
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="キーワード"
            className="p-1 px-2 w-36 border border-[#f9a691] rounded text-sm bg-white"
          />
  
          <button
            type="submit"
            className="px-3 py-1 bg-[#f9a691] hover:bg-[#ef866b] text-white font-semibold rounded text-sm"
          >
            検索
          </button>
        </div>
      </form>
    </div>
  );  
}
