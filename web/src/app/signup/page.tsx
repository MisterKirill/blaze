import SignupForm from "@/components/forms/SignupForm";
import TextLink from "@/components/ui/TextLink";
import { getUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up - Blaze",
  description: "Create a free account and start streaming or watching your favorite streamers on Blaze",
};

export default async function Signup() {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="text-center">
      <h1 className="font-bold text-4xl mb-4">Dive into the Blaze</h1>
      <p className="mb-6">
        Create a free account and start streaming or watching your favorite streamers on Blaze:
      </p>

      <SignupForm />

      <p className="mt-6">
        Already a part of Blaze? <TextLink href="/signin">Sign in</TextLink>
      </p>
    </div>
  );
}
