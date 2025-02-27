"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";
import { useState } from "react";
import { User } from "@/lib/auth";
import { Radio, Settings, UserRound } from "lucide-react";

export default function Header({ user }: { user: User | null }) {
  const [menuOpened, setMenuOpened] = useState(false);

  const switchMenuOpened = () => setMenuOpened((menuOpened) => !menuOpened);

  return (
    <>
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

        <form role="search" action="/search" className="hidden md:block max-w-[40rem] w-full mx-8">
          <input
            type="text"
            name="q"
            className="px-4 py-3 font-medium text-sm bg-slate-800 rounded-full w-full outline-hidden focus:ring-2 ring-blue-600"
            placeholder="Search users or streams..."
          />
        </form>

        {user ? (
          <div className="hidden md:flex gap-2">
            <Link href="/settings" className="text-slate-400 hover:bg-slate-800 p-2 rounded-lg">
              <Settings size={25} />
            </Link>
            <Link href="/dashboard" className="text-slate-400 hover:bg-slate-800 p-2 rounded-lg">
              <Radio size={25} />
            </Link>
            <Link href={`/${user.username}`} className="text-slate-400 hover:bg-slate-800 p-2 rounded-lg">
              <UserRound size={25} />
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex gap-2">
            <Link href="/signin">
              <Button className="bg-transparent hover:bg-slate-800">Sign In</Button>
            </Link>

            <Link href="/signup">
              <Button>Join Blaze</Button>
            </Link>
          </div>
        )}

        {menuOpened ? (
          <button onClick={switchMenuOpened} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 text-slate-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button onClick={switchMenuOpened} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        )}
      </header>

      {menuOpened && (
        <div className="container flex flex-col gap-4 items-center">
          <form role="search" action="/search" className="max-w-[40rem] w-full">
            <input
              type="text"
              name="q"
              className="px-4 py-3 font-medium text-sm bg-slate-800 rounded-full w-full outline-hidden focus:ring-2 ring-blue-600"
              placeholder="Search users or streams..."
            />
          </form>

          {user ? (
            <div className="flex gap-2">
              <Link href="/settings" className="text-slate-400 hover:bg-slate-800 p-2 rounded-lg">
                <Settings size={25} />
              </Link>
              <Link href="/dashboard" className="text-slate-400 hover:bg-slate-800 p-2 rounded-lg">
                <Radio size={25} />
              </Link>
              <Link href={`/${user.username}`} className="text-slate-400 hover:bg-slate-800 p-2 rounded-lg">
                <UserRound size={25} />
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/signin">
                <Button className="bg-transparent hover:bg-slate-800">Sign In</Button>
              </Link>

              <Link href="/signup">
                <Button>Join Blaze</Button>
              </Link>
            </div>
          )}

          <hr className="border-slate-800 border-2 w-full" />
        </div>
      )}
    </>
  );
}
