import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Blaze",
  description: "Stream, watch and follow streamers on Blaze - simple video streaming platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.className} antialiased text-slate-200`}>
        <Header />

        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
