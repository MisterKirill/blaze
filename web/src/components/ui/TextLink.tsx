import { Link, LinkProps } from '@tanstack/react-router'

export default function TextLink({ children, ...props }: LinkProps) {
  return (
    <Link className="text-orange-300 font-medium hover:underline" {...props}>
      {children}
    </Link>
  )
}
