import TextLink from "@/components/ui/TextLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found - Blaze",
};

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="font-bold text-4xl mb-4">Not Found</h1>
      <p className="mb-4">This page was not found on this server.</p>
      <TextLink href="/">Homepage</TextLink>
    </div>
  );
}
