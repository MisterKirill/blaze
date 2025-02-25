import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";

export default function Header() {
  return (
    <header className="flex container py-6 items-center justify-between">
      <Link href="/">
        <Image
          src="/big_logo.svg"
          alt="Blaze logo"
          className="h-5 w-auto hover:opacity-85"
          width={0}
          height={0}
          priority
        />
      </Link>

      <form action="/search" className="max-w-[40rem] w-full">
        <input
          type="text"
          name="q"
          className="px-4 py-3 font-medium text-sm bg-slate-800 rounded-full w-full outline-none focus:ring-2 ring-blue-600"
          placeholder="Search users or streams..."
        />
      </form>

      <div className="flex gap-2">
        <Link href="/signin">
          <Button className="bg-transparent hover:bg-slate-800">Sign In</Button>
        </Link>

        <Link href="/signup">
          <Button>Join Blaze</Button>
        </Link>
      </div>
    </header>
  );
}
