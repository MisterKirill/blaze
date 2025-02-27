import SigninForm from "@/components/forms/SigninForm";
import TextLink from "@/components/ui/TextLink";
import { getUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In - Blaze",
  description: "Log into your account and start streaming or watching your favorite streamers on Blaze",
};

export default async function Signin() {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="text-center">
      <h1 className="font-bold text-4xl mb-4">Welcome Back!</h1>
      <p className="mb-6">
        Log into your account and start streaming or watching your favorite streamers on Blaze:
      </p>

      <SigninForm />

      <p className="mt-6">
        Don&apos;t have an account? <TextLink href="/signup">Sign up</TextLink>
      </p>
    </div>
  );
}
