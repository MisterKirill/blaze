import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getUsername } from "@/lib/auth";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Blaze",
  description: "Join the new video streaming platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = await getUsername();

  return (
    <html lang="en">
      <body className={`${notoSans.className} bg-slate-900 text-white antialiased`}>
        <ProgressBar />

        <div className="flex flex-col h-screen">
          <Header username={username} />
          <main className="container mt-4 mb-24 grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
