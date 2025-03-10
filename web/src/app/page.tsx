import StreamCard from "@/components/StreamCard";
import Button from "@/components/ui/Button";
import { getActiveStreams } from "@/lib/api";
import { getUsername } from "@/lib/auth";
import { Radio } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blaze",
};

export default async function Home() {
  const user = await getUsername();

  let failed = false;
  let active_streams = [];

  try {
    const res = await getActiveStreams();
    active_streams = res.active_streams;
  } catch {
    failed = true;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Radio size={40} />
        <h1 className="font-semibold text-3xl">Active streams</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {failed ? (
          <p>Failed to load active streams, please try again in a few seconds.</p>
        ) : active_streams.length == 0 ? (
          <p>No one is streaming right now. Be the first!</p>
        ) : (
          active_streams.map((stream: unknown, i: number) => <StreamCard key={i} stream={stream} />)
        )}
      </div>

      {!user && (
        <div>
          <h1 className="font-semibold text-3xl mb-4">Join Blaze</h1>
          <p className="mb-3">
            Create a free account and start streaming or watching your favorite streamers:
          </p>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      )}
    </>
  );
}
