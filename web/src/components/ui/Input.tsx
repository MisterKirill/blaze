import { InputHTMLAttributes } from 'react'

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className="bg-zinc-800 font-medium py-2 px-4 rounded text-sm outline-zinc-700 focus:outline-zinc-500 hover:outline-2 focus:outline-2" {...props} />
  )
}
