import { Metadata } from "next";
import TextLink from "@/components/ui/TextLink";
import RegisterForm from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Register - Blaze",
};

export default function Page() {
  return (
    <div className="text-center">
      <h1 className="font-bold text-4xl mb-4">Dive into the Blaze</h1>
      <span>Create a free account and start streaming or following your favorite streamers on Blaze:</span>

      <RegisterForm />

      <span>Already have an account? Please, <TextLink href="/login">log in</TextLink>.</span>
    </div>
  );
}
