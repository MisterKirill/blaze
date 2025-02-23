import TextLink from "@/components/ui/TextLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found - Blaze",
};

export default function NotFound() {
  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Not Found</h1>
      <span>
        This page was not found. You can go to the <TextLink href="/">homepage</TextLink> or <TextLink href="/contact">contact us</TextLink> if you think there is a mistake.
      </span>
    </>
  );
}
