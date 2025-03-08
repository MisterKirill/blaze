import { User } from "@/lib/api";
import Link from "next/link";

export default function SearchUserCard({ user }: { user: User }) {
  return (
    <Link href={`/${user.username}`} className="flex flex-col p-4 bg-slate-800 rounded-xl hover:bg-slate-700">
      {user.display_name && (
        <span className="text-slate-200 font-bold text-xl">{user.display_name}</span>
      )}
      
      <span className={user.display_name ? "text-slate-400 font-medium" : "text-slate-200 font-bold text-xl"}>
        @{user.username}
      </span>
    </Link>
  );
}
