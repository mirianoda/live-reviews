"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 py-10 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* ロゴとキャッチコピー */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Image src="/logo/logo5.png" alt="ロゴ" width={140} height={40} />
          </div>
          <p className="text-sm text-gray-500">ライブの席レポ共有サービス</p>
        </div>

        {/* Aboutセクション */}
        <div>
          <h3 className="font-bold mb-2 text-sm">About</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/terms">利用規約</Link></li>
            <li><Link href="/privacy-policy">プライバシーポリシー</Link></li>
          </ul>
        </div>

        {/* Linksセクション */}
        <div>
          <h3 className="font-bold mb-2 text-sm">Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">会場一覧</Link></li>
            <li><Link href="/mypage">マイページ</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
