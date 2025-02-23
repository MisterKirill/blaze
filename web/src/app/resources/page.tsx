import TextLink from "@/components/ui/TextLink";

export default function Page() {
  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Resources</h1>
      <p className="flex flex-col items-start text-2xl">
        <TextLink href="https://github.com/MisterKirill/blaze">Source code</TextLink>
        <TextLink href="https://github.com/MisterKirill/blaze/tree/main/branding">Branding resources</TextLink>
      </p>
    </>
  );
}
