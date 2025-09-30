import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/lib/SupabaseProvider";
import { Toaster } from "react-hot-toast";

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
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
      <body className={`${zenMaruGothic.variable} antialiased`}>
        <Header />
        <SupabaseProvider>{children}</SupabaseProvider>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "font-zen",
              background: "primary-lighter",
              color: "foreground",
              fontSize: "14px",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
