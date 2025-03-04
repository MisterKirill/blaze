import { getUserData } from "@/lib/auth";
import { Metadata } from "next";
import StreamKey from "./StreamKey";

export const metadata: Metadata = {
  title: "Dashboard - Blaze",
};

export default async function Dashboard() {
  const userData = await getUserData();

  if (!userData) {
    return <span>Failed to get user data. Please, try again in a few seconds.</span>;
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Stream Key</h2>
      <p className="font-bold bg-red-400 w-fit p-3 rounded-lg mb-6">
        Don&apos;t share your stream key with anyone you don&apos;t trust!
      </p>
      <StreamKey streamKey={userData.stream_key} />
    </>
  );
}
