import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export interface TextLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export default function TextLink({ children, className, ...props }: TextLinkProps) {
  return (
    <Link className={`${className} text-blue-300 hover:text-blue-400`} {...props}>
      {children}
    </Link>
  );
}
