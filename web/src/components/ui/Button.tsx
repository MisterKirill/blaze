import { ButtonHTMLAttributes } from 'react'

export default function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded cursor-pointer text-sm" {...props}>
      {children}
    </button>
  )
}
