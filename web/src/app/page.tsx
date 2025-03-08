import StreamCard from "@/components/StreamCard";
import Button from "@/components/ui/Button";
import { getUsername } from "@/lib/auth";
import { getStreams } from "@/lib/api";
import { Radio } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blaze",
};

export default async function Home() {
  // const user = await getUsername();
  // const streams = await getStreams();

  return (
    <>
      {/* <div className="flex items-center gap-4 mb-4">
        <Radio size={40} />
        <h1 className="font-semibold text-3xl">Active streams</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {streams ? (
          streams.length == 0 ? (
            <p>No one is streaming right now. Be the first!</p>
          ) : (
            streams.map((stream) => <StreamCard key={stream.username} stream={stream} />)
          )
        ) : (
          <p>Failed to load active streams, please try again.</p>
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
      )} */}
    </>
  );
}
