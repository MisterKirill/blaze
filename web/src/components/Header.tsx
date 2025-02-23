import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";
import { LuSettings, LuUserRound } from "react-icons/lu";
import { getUser } from "@/utils/auth";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="container flex items-center justify-between py-6">
      <Link href="/" className="hover:opacity-80">
        <Image src="/logo.svg" alt="Blaze Logo" className="h-5 w-auto" width={0} height={0} priority />
      </Link>

      {user ? (
        <div className="flex gap-6">
          <Link href="/settings">
            <LuSettings size={30} className="text-slate-300 hover:text-slate-400" />
          </Link>
          <Link href={`/${user.username}`}>
            <LuUserRound size={30} className="text-slate-300 hover:text-slate-400" />
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login">
            <Button isGhost>Log In</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
