import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { signOut } from "../actions";
import { redirect } from "next/navigation";
import StreamKey from "./StreamKey";
import { getMe } from "@/lib/api";

export const metadata: Metadata = {
  title: "Settings - Blaze",
};

export default async function Settings() {
  const res = await getMe();
  const me = await res.json();

  if (res.status !== 200) {
    redirect("/signin");
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Stream Key</h2>
      <p className="font-bold bg-red-400 w-fit p-3 rounded-lg mb-6">
        Don&apos;t share your stream key with anyone you don&apos;t trust!
      </p>
      <StreamKey streamKey={me.stream_key} />

      <h2 className="mb-4 text-2xl font-bold mt-6">Danger Zone</h2>
      <Button className="bg-red-500 hover:bg-red-600" onClick={signOut}>
        Sign out
      </Button>
    </>
  );
}
