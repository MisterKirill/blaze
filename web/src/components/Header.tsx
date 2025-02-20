import { Settings, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="container flex items-center justify-between py-8">
      <Link href="/">
        <Image src="/logo.svg" alt="Blaze Logo" className="h-6 w-auto" width={0} height={0} />
      </Link>

      <div className="flex gap-8">
        <Link href="/settings">
          <Settings size={26} className="text-slate-300 hover:text-slate-400" />
        </Link>
        <Link href="/user">
          <UserRound size={26} className="text-slate-300 hover:text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
