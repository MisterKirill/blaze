import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export default function TextLink({ children, ...props }: PropsWithChildren<LinkProps>) {
  return (
    <Link className="font-semibold text-blue-400 hover:text-blue-500" {...props}>
      {children}
    </Link>
  );
}
