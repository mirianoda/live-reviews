import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { Zen_Maru_Gothic } from "next/font/google"; // ← 追加
import "./globals.css";
import SupabaseProvider from "@/lib/SupabaseProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zenMaruGothic = Zen_Maru_Gothic({ // ← 追加
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["400"], // 必要なら ["400", "700"] など
});

export const metadata: Metadata = {
  title: "ライブ会場口コミサイト | 席レポ",
  description: "アイドルファンのための座席口コミ共有サイト",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zenMaruGothic.variable} antialiased`}
      >
      <Header />
        <SupabaseProvider>{children}</SupabaseProvider>
      <Footer />
      </body>
    </html>
  );
}
