import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";
import { Settings, UserRound } from "lucide-react";
import { getUser } from "@/utils/auth";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="container flex items-center justify-between py-8">
      <Link href="/" className="hover:opacity-80">
        <Image src="/logo.svg" alt="Blaze Logo" className="h-5 w-auto" width={0} height={0} />
      </Link>

      {user ? (
        <div className="flex gap-6">
          <Link href="/settings">
            <Settings size={30} className="text-slate-300 hover:text-slate-400" />
          </Link>
          <Link href={`/${user.username}`}>
            <UserRound size={30} className="text-slate-300 hover:text-slate-400" />
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
