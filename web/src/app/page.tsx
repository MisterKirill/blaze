import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="font-semibold text-4xl mb-6">Join Blaze</h1>
      <div className="flex flex-col md:flex-row gap-8 md:items-center">
        <span className="max-w-[26rem]">
          Create a free account and start streaming or watching your favorite streamers:
        </span>
        <Link href="/register">
          <Button>Register</Button>
        </Link>
      </div>
    </>
  );
}
