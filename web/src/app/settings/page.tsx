import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings - Blaze",
};

export default function Settings() {
  const signOut = async () => {
    "use server";
    (await cookies()).delete("token");
    redirect("/login");
  }

  return (
    <>
      <h1 className="mb-4 font-bold text-4xl">Settings</h1>

      <h2 className="mb-4 text-2xl font-bold">Account settings</h2>

      <Button className="bg-red-500 hover:bg-red-600" onClick={signOut}>
        Sign out
      </Button>
    </>
  );
}
