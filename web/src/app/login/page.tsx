import { Metadata } from "next";
import TextLink from "@/components/ui/TextLink";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Login - Blaze",
};

export default function Page() {
  return (
    <div className="text-center">
      <h1 className="font-bold text-4xl mb-4">Welcome back!</h1>
      <span>Please, provide an email and password to log in:</span>

      <LoginForm />

      <span>Don&apos;t have an account yet? Register <TextLink href="/register">here</TextLink>.</span>
    </div>
  );
}
