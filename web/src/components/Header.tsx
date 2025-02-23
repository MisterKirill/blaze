import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";

export default function Header() {
  return (
    <header className="container flex items-center justify-between py-6">
      <Link href="/" className="hover:opacity-80">
        <Image src="/logo.svg" alt="Blaze Logo" className="h-5 w-auto" width={0} height={0} />
      </Link>

      <div className="flex gap-4">
        {/* <Link href="/settings">
          <Settings size={26} className="text-slate-300 hover:text-slate-400" />
        </Link>
        <Link href="/user">
          <UserRound size={26} className="text-slate-300 hover:text-slate-400" />
        </Link> */}
        <Link href="/login">
          <Button isGhost>Log In</Button>
        </Link>
        <Link href="/register">
          <Button>Register</Button>
        </Link>
      </div>
    </header>
  );
}
