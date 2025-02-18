import { ButtonHTMLAttributes } from 'react'

export default function IconButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="p-2 rounded cursor-pointer hover:bg-zinc-600" {...props}>
      {children}
    </button>
  )
}
