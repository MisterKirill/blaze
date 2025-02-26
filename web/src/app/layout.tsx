import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getUser } from "@/lib/auth";

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
  const user = await getUser();

  return (
    <html lang="en">
      <body className={`${notoSans.className} bg-slate-900 text-white antialiased`}>
        <Header user={user} />
        
        <main className="container mt-4">{children}</main>
      </body>
    </html>
  );
}
